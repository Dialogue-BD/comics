#!/Users/timothyhall/.gemini/antigravity/brain/87f8e142-20ff-4c76-8e59-44070b5e1fb0/scratch/sam2-venv/bin/python
"""One-time offline SAM 2.1 video entity tracker for Forevergreen.

Tracks canonical entities across every real shot in
forevergreen/production/canonical-shots.json using facebook/sam2.1-hiera-small
on Apple Silicon MPS (or CPU fallback), writing per-frame normalized boxes
[t, ymin, xmin, ymax, xmax] (or [t, None]) to
forevergreen/production/sam2-tracks.json.
"""

from __future__ import annotations

import argparse
import gc
import json
import math
import subprocess
import time
from collections import defaultdict
from pathlib import Path

import numpy as np
import torch
from PIL import Image, ImageDraw, ImageFont
from transformers import Sam2VideoModel, Sam2VideoProcessor

ROOT = Path(__file__).resolve().parent.parent
PROD = ROOT / "production"
VIDEO_PATH = ROOT / "video" / "forevergreen.mp4"
CANONICAL_SHOTS_PATH = PROD / "canonical-shots.json"
DEFAULT_OUT = PROD / "sam2-tracks.json"

DEFAULT_W = 640
DEFAULT_H = 360
STATIC_TERRAIN_IDS = {"canyon", "cliff", "pine_trees", "soil_mound", "snow", "trail"}

PALETTE = [
    (56, 189, 248),
    (250, 204, 21),
    (74, 222, 128),
    (244, 114, 182),
    (251, 146, 60),
    (167, 139, 250),
    (45, 212, 191),
    (248, 113, 113),
]


def extract_frames_ffmpeg(start: float, end: float, fps: float, w: int, h: int) -> list[np.ndarray]:
    dur = max(0.25, end - start)
    cmd = [
        "ffmpeg",
        "-hide_banner",
        "-loglevel",
        "error",
        "-ss",
        f"{start:.3f}",
        "-t",
        f"{dur:.3f}",
        "-i",
        str(VIDEO_PATH),
        "-vf",
        f"fps={fps},scale={w}:{h}",
        "-f",
        "rawvideo",
        "-pix_fmt",
        "rgb24",
        "pipe:1",
    ]
    raw = subprocess.check_output(cmd)
    frame_bytes = w * h * 3
    n = len(raw) // frame_bytes
    if n <= 0:
        return []
    arr = np.frombuffer(raw[: n * frame_bytes], dtype=np.uint8).reshape((n, h, w, 3)).copy()
    return [arr[i] for i in range(n)]


def box_area_norm(box: list[int]) -> float:
    return max(0, box[2] - box[0]) * max(0, box[3] - box[1]) / 1_000_000.0


def box_iou(a: list[int], b: list[int]) -> float:
    iy1 = max(a[0], b[0])
    ix1 = max(a[1], b[1])
    iy2 = min(a[2], b[2])
    ix2 = min(a[3], b[3])
    inter = max(0, iy2 - iy1) * max(0, ix2 - ix1)
    if inter <= 0:
        return 0.0
    ua = max(1, (a[2] - a[0]) * (a[3] - a[1]))
    ub = max(1, (b[2] - b[0]) * (b[3] - b[1]))
    return inter / max(1, ua + ub - inter)


def box_center(box: list[int]) -> tuple[float, float]:
    return ((box[1] + box[3]) * 0.5, (box[0] + box[2]) * 0.5)


def mask_to_norm_box(mask_2d: np.ndarray) -> tuple[list[int] | None, float, float]:
    """Convert raw logit mask (H_m x W_m) to normalized [ymin, xmin, ymax, xmax] in 0..1000."""
    peak_logit = float(mask_2d.max())
    if peak_logit < 0.0:
        return None, peak_logit, 0.0
    fg = mask_2d > 0.0
    fg_count = int(fg.sum())
    total_px = mask_2d.shape[0] * mask_2d.shape[1]
    area_frac = fg_count / max(1, total_px)
    if fg_count < 8 or area_frac < 0.00035:
        return None, peak_logit, area_frac
    ys, xs = np.where(fg)
    mh, mw = mask_2d.shape
    ymin = max(0, min(999, int(round(int(ys.min()) * 1000.0 / mh))))
    xmin = max(0, min(999, int(round(int(xs.min()) * 1000.0 / mw))))
    ymax = max(ymin + 2, min(1000, int(round((int(ys.max()) + 1) * 1000.0 / mh))))
    xmax = max(xmin + 2, min(1000, int(round((int(xs.max()) + 1) * 1000.0 / mw))))
    return [ymin, xmin, ymax, xmax], peak_logit, area_frac


def compute_active_fis(ent: dict, times: list[float], shot_start: float, fps: float) -> set[int]:
    n = len(times)
    active: set[int] = set()
    for beat in ent.get("beats", []):
        b_start = float(beat["start"]) - 0.15
        b_end = float(beat["end"]) + 0.15
        for fi, t in enumerate(times):
            if b_start <= t <= b_end:
                active.add(fi)
    for sd in ent.get("seeds", []):
        fi = max(0, min(n - 1, int(round((float(sd["frameSec"]) - shot_start) * fps))))
        active.add(fi)
    return active


def track_static_terrain(
    ent: dict,
    times: list[float],
    mean_rgb: list[np.ndarray],
    shot_start: float,
    fps: float,
) -> list[list]:
    """Emit each beat's seed box ONLY within [beat.start-0.15, beat.end+0.15] & rgb_diff <= 0.14."""
    n = len(times)
    beats = ent.get("beats", [])
    seeds_by_kf = {sd["keyframeId"]: sd for sd in ent.get("seeds", [])}

    out = []
    for fi, t in enumerate(times):
        matched_box = None
        best_gap = float("inf")
        for beat in beats:
            b_start = float(beat["start"]) - 0.15
            b_end = float(beat["end"]) + 0.15
            if not (b_start <= t <= b_end):
                continue
            sd = seeds_by_kf.get(beat["keyframeId"])
            if sd is None:
                continue
            sd_fi = max(0, min(n - 1, int(round((float(sd["frameSec"]) - shot_start) * fps))))
            rgb_diff = float(np.abs(mean_rgb[fi] - mean_rgb[sd_fi]).mean())
            if fi == sd_fi or rgb_diff <= 0.14:
                gap = abs(fi - sd_fi)
                if gap < best_gap:
                    best_gap = gap
                    matched_box = sd["box"]
        if matched_box is not None:
            out.append([t, *matched_box])
        else:
            out.append([t, None])
    return out


def group_entities_tightly(ent_entries: list[dict]) -> list[list[dict]]:
    """Partition dynamic entities into tightly aligned span groups to avoid redundant reverse passes."""
    if not ent_entries:
        return []
    ordered = sorted(ent_entries, key=lambda item: (item["first_seed"], item["lo"], item["hi"]))
    groups: list[list[dict]] = []
    cur_group: list[dict] = [ordered[0]]
    cur_first_seed = ordered[0]["first_seed"]
    cur_hi = ordered[0]["hi"]

    for item in ordered[1:]:
        if (
            item["first_seed"] - cur_first_seed <= 2
            and abs(item["hi"] - cur_hi) <= 5
            and cur_hi - item["lo"] >= 1
        ):
            cur_group.append(item)
            cur_first_seed = max(cur_first_seed, item["first_seed"])
            cur_hi = max(cur_hi, item["hi"])
        else:
            groups.append(cur_group)
            cur_group = [item]
            cur_first_seed = item["first_seed"]
            cur_hi = item["hi"]
    groups.append(cur_group)
    return groups


def track_dynamic_group_sam2(
    group: list[dict],
    frames: list[np.ndarray],
    times: list[float],
    mean_rgb: list[np.ndarray],
    model: Sam2VideoModel,
    processor: Sam2VideoProcessor,
    device: str,
    model_dtype: torch.dtype,
    w: int,
    h: int,
) -> dict[str, list[list]]:
    g_lo = min(entry["lo"] for entry in group)
    g_hi = max(entry["hi"] for entry in group)
    sub_frames = frames[g_lo : g_hi + 1]
    g_len = len(sub_frames)

    session = processor.init_video_session(
        video=sub_frames,
        inference_device=device,
        dtype=model_dtype,
        max_vision_features_cache_size=g_len + 2,
    )

    ent_by_oid: dict[int, dict] = {}
    seeds_by_local_fi: dict[int, list[tuple[int, list[float]]]] = defaultdict(list)
    seed_local_map_by_oid: dict[int, dict[int, list[int]]] = defaultdict(dict)

    for oid, entry in enumerate(group, start=1):
        ent_by_oid[oid] = entry
        for global_fi, sd_box in entry["seed_map"].items():
            lfi = global_fi - g_lo
            ymin, xmin, ymax, xmax = sd_box
            px_box = [
                round(xmin * w / 1000.0, 2),
                round(ymin * h / 1000.0, 2),
                round(xmax * w / 1000.0, 2),
                round(ymax * h / 1000.0, 2),
            ]
            seeds_by_local_fi[lfi].append((oid, px_box))
            seed_local_map_by_oid[oid][lfi] = sd_box

    sorted_local_seed_fis = sorted(seeds_by_local_fi.keys())
    for lfi in sorted_local_seed_fis:
        frame_items = seeds_by_local_fi[lfi]
        obj_ids = [x[0] for x in frame_items]
        input_boxes = [[x[1] for x in frame_items]]
        processor.add_inputs_to_inference_session(
            session,
            frame_idx=lfi,
            obj_ids=obj_ids,
            input_boxes=input_boxes,
            original_size=(h, w),
        )
        with torch.inference_mode():
            model(inference_session=session, frame_idx=lfi)

    # obs[oid][lfi] = (box_norm_or_None, obj_score, peak_logit, area_frac)
    obs: dict[int, dict[int, tuple[list[int] | None, float, float, float]]] = defaultdict(dict)

    def record_output(out):
        lfi = int(out.frame_idx)
        masks_np = out.pred_masks.detach().float().cpu().numpy()
        scores_np = (
            out.object_score_logits.detach().float().cpu().numpy().reshape(-1)
            if getattr(out, "object_score_logits", None) is not None
            else None
        )
        for pos, oid in enumerate(out.object_ids):
            m = masks_np[pos]
            if m.ndim == 3:
                m = m[0]
            box_norm, peak_logit, area_frac = mask_to_norm_box(m)
            obj_score = float(scores_np[pos]) if scores_np is not None and pos < len(scores_np) else 5.0
            prev = obs[oid].get(lfi)
            if prev is None or (obj_score + peak_logit * 0.25) > (prev[1] + prev[2] * 0.25):
                obs[oid][lfi] = (box_norm, obj_score, peak_logit, area_frac)

    min_local_seed_fi = sorted_local_seed_fis[0]
    max_first_seed_local_fi = max(min(seed_local_map_by_oid[oid].keys()) for oid in ent_by_oid)

    with torch.inference_mode():
        for out in model.propagate_in_video_iterator(session, start_frame_idx=min_local_seed_fi, reverse=False):
            record_output(out)
        if max_first_seed_local_fi > 0:
            for out in model.propagate_in_video_iterator(
                session,
                start_frame_idx=max_first_seed_local_fi,
                reverse=True,
                max_frame_num_to_track=max_first_seed_local_fi,
            ):
                record_output(out)

    session.reset_tracking_data()
    del session
    if device == "mps":
        torch.mps.empty_cache()
    gc.collect()

    group_tracks: dict[str, list[list]] = {}
    n_total = len(times)

    for oid, entry in ent_by_oid.items():
        ent = entry["ent"]
        active_fis: set[int] = entry["active_fis"]
        seed_map: dict[int, list[int]] = entry["seed_map"]
        seed_fis = sorted(seed_map.keys())
        max_seed_area = max(box_area_norm(b) for b in seed_map.values())
        min_seed_area = min(box_area_norm(b) for b in seed_map.values())
        is_part_or_prop = ent["category"] in ("part", "prop", "expression")

        filtered_boxes: list[list[int] | None] = [None] * n_total
        for fi in range(n_total):
            if fi not in active_fis:
                continue
            if fi in seed_map:
                sd_box = seed_map[fi]
                lfi = fi - g_lo
                cand = obs[oid].get(lfi)
                if cand and cand[0] is not None and box_iou(cand[0], sd_box) >= 0.28:
                    filtered_boxes[fi] = cand[0]
                else:
                    filtered_boxes[fi] = sd_box
                continue

            lfi = fi - g_lo
            cand = obs[oid].get(lfi)
            if cand is None or cand[0] is None:
                continue
            box, obj_score, peak_logit, _ = cand
            if obj_score < 0.0 or peak_logit < 0.5:
                continue
            area = box_area_norm(box)
            if is_part_or_prop and area > max(0.28, max_seed_area * 4.2):
                continue
            if area < min_seed_area * 0.12 and peak_logit < 2.2:
                continue
            filtered_boxes[fi] = box

        # Outward temporal continuity strictly inside active_fis (never cross gaps / cuts / teleports)
        keep = [False] * n_total
        for sf in seed_fis:
            keep[sf] = True
            for step in (-1, 1):
                prev_fi = sf
                prev_box = filtered_boxes[sf]
                fi = sf + step
                while 0 <= fi < n_total:
                    if fi in seed_map:
                        break
                    if fi not in active_fis:
                        break
                    cur_box = filtered_boxes[fi]
                    if cur_box is None or prev_box is None:
                        break
                    c_prev = box_center(prev_box)
                    c_cur = box_center(cur_box)
                    if math.hypot(c_cur[0] - c_prev[0], c_cur[1] - c_prev[1]) > 360.0:
                        break
                    rgb_step = float(np.abs(mean_rgb[fi] - mean_rgb[prev_fi]).mean())
                    lfi = fi - g_lo
                    if rgb_step > 0.20 and obs[oid].get(lfi, (None, -1.0, 0.0, 0.0))[1] < 2.0:
                        break
                    keep[fi] = True
                    prev_fi = fi
                    prev_box = cur_box
                    fi += step

        rows = []
        for fi in range(n_total):
            if keep[fi] and filtered_boxes[fi] is not None:
                rows.append([times[fi], *filtered_boxes[fi]])
            else:
                rows.append([times[fi], None])
        group_tracks[ent["id"]] = rows

    return group_tracks


def track_shot_sam2(
    shot: dict,
    model: Sam2VideoModel,
    processor: Sam2VideoProcessor,
    device: str,
    model_dtype: torch.dtype,
    fps: float,
    w: int,
    h: int,
) -> tuple[dict[str, list[list]], list[np.ndarray], list[float]]:
    frames = extract_frames_ffmpeg(shot["start"], shot["end"], fps=fps, w=w, h=h)
    if not frames:
        return {}, [], []
    n = len(frames)
    times = [round(shot["start"] + i / fps, 2) for i in range(n)]
    mean_rgb = [f.mean(axis=(0, 1)) / 255.0 for f in frames]

    result: dict[str, list[list]] = {}
    dynamic_entries: list[dict] = []

    for ent in shot["entities"]:
        if ent["entityId"] in STATIC_TERRAIN_IDS:
            result[ent["id"]] = track_static_terrain(ent, times, mean_rgb, shot["start"], fps)
        else:
            active_fis = compute_active_fis(ent, times, shot["start"], fps)
            seed_map = {}
            for sd in ent["seeds"]:
                fi = max(0, min(n - 1, int(round((float(sd["frameSec"]) - shot["start"]) * fps))))
                seed_map[fi] = sd["box"]
            lo = min(active_fis)
            hi = max(active_fis)
            dynamic_entries.append({
                "ent": ent,
                "active_fis": active_fis,
                "seed_map": seed_map,
                "first_seed": min(seed_map.keys()),
                "lo": lo,
                "hi": hi,
            })

    for group in group_entities_tightly(dynamic_entries):
        grp_tracks = track_dynamic_group_sam2(
            group, frames, times, mean_rgb, model, processor, device, model_dtype, w, h
        )
        result.update(grp_tracks)

    return result, frames, times


def render_strip(
    shot: dict,
    tracks: dict[str, list[list]],
    frames: list[np.ndarray],
    times: list[float],
    out_dir: Path,
) -> Path | None:
    if not frames:
        return None
    out_dir.mkdir(parents=True, exist_ok=True)
    n = len(frames)
    picks = set()
    for t_kf in shot.get("keyframeSecs", []):
        fi = max(0, min(n - 1, min(range(n), key=lambda i: abs(times[i] - t_kf))))
        picks.add(fi)
    for frac in (0.15, 0.5, 0.85):
        picks.add(max(0, min(n - 1, int(round(frac * (n - 1))))))
    chosen = sorted(picks)[:6]

    cols = min(3, len(chosen))
    rows = (len(chosen) + cols - 1) // cols
    h, w, _ = frames[0].shape
    canvas = Image.new("RGB", (cols * w, rows * (h + 26)), (18, 18, 22))
    draw_all = ImageDraw.Draw(canvas)
    font = ImageFont.load_default()

    for idx, fi in enumerate(chosen):
        r, c = divmod(idx, cols)
        ox, oy = c * w, r * (h + 26)
        panel = Image.fromarray(frames[fi]).copy()
        d = ImageDraw.Draw(panel)
        for ei, ent in enumerate(shot["entities"]):
            tr = tracks.get(ent["id"])
            if not tr or fi >= len(tr) or tr[fi][1] is None:
                continue
            _, ymin, xmin, ymax, xmax = tr[fi]
            x1 = int(round(xmin * w / 1000.0))
            y1 = int(round(ymin * h / 1000.0))
            x2 = int(round(xmax * w / 1000.0))
            y2 = int(round(ymax * h / 1000.0))
            color = PALETTE[ei % len(PALETTE)]
            d.rectangle([x1, y1, x2, y2], outline=color, width=2)
            label = ent["name"]
            tb = d.textbbox((x1, max(0, y1 - 12)), label, font=font)
            d.rectangle([tb[0] - 2, tb[1] - 1, tb[2] + 2, tb[3] + 1], fill=(15, 15, 20))
            d.text((x1, max(0, y1 - 12)), label, fill=color, font=font)
        canvas.paste(panel, (ox, oy + 24))
        ts = times[fi]
        m = int(ts // 60)
        s = ts - m * 60
        draw_all.text((ox + 8, oy + 5), f"{shot['id']}  {m}m{s:04.1f}s", fill=(250, 204, 21), font=font)

    out_file = out_dir / f"{shot['id']}_strip.jpg"
    canvas.save(out_file, quality=90)
    return out_file


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--model", default="facebook/sam2.1-hiera-small")
    parser.add_argument("--fps", type=float, default=2.0)
    parser.add_argument("--width", type=int, default=DEFAULT_W)
    parser.add_argument("--height", type=int, default=DEFAULT_H)
    parser.add_argument("--shots", default="", help="Comma-separated shot IDs to process")
    parser.add_argument("--resume", action="store_true", help="Skip shots already saved in output file")
    parser.add_argument("--verify-strip", default="", help="Optional folder for verification strip JPGs")
    parser.add_argument("--out", default=str(DEFAULT_OUT))
    args = parser.parse_args()

    shots = json.loads(CANONICAL_SHOTS_PATH.read_text(encoding="utf-8"))
    out_path = Path(args.out)

    existing: dict[str, list[list]] = {}
    if args.resume and out_path.exists():
        existing = json.loads(out_path.read_text(encoding="utf-8"))
        print(f"Resuming with {len(existing)} existing tracked items in {out_path.name}", flush=True)

    wanted = {s.strip() for s in args.shots.split(",") if s.strip()} if args.shots else None
    todo = []
    for sh in shots:
        if wanted is not None and sh["id"] not in wanted:
            continue
        if not sh["entities"]:
            continue
        if args.resume and all(e["id"] in existing for e in sh["entities"]):
            continue
        todo.append(sh)

    print(f"Queued {len(todo)} shots for SAM 2 tracking ({args.model}, fps={args.fps}).", flush=True)
    if not todo and not args.verify_strip:
        return 0

    device = "mps" if torch.backends.mps.is_available() else "cpu"
    model_dtype = torch.float16 if device == "mps" else torch.float32
    t0 = time.time()
    model = Sam2VideoModel.from_pretrained(args.model, dtype=model_dtype).to(device)
    model.num_maskmem = 3
    model.eval()
    processor = Sam2VideoProcessor.from_pretrained(args.model)
    print(f"Loaded {args.model} ({model_dtype}, nmem=3) on {device} in {time.time() - t0:.1f}s.", flush=True)

    strip_dir = Path(args.verify_strip) if args.verify_strip else None
    merged = dict(existing)

    process_list = todo if todo else [sh for sh in shots if wanted and sh["id"] in wanted]

    for idx, sh in enumerate(process_list, start=1):
        ts0 = time.time()
        if all(e["id"] in merged for e in sh["entities"]) and args.resume:
            frames = extract_frames_ffmpeg(sh["start"], sh["end"], fps=args.fps, w=args.width, h=args.height)
            times = [round(sh["start"] + i / args.fps, 2) for i in range(len(frames))]
            shot_tracks = {e["id"]: merged[e["id"]] for e in sh["entities"]}
        else:
            shot_tracks, frames, times = track_shot_sam2(
                sh, model, processor, device=device, model_dtype=model_dtype, fps=args.fps, w=args.width, h=args.height
            )
            merged.update(shot_tracks)
            if idx % 5 == 0 or idx == len(process_list):
                tmp = out_path.with_suffix(".tmp")
                tmp.write_text(json.dumps(merged, ensure_ascii=False), encoding="utf-8")
                tmp.replace(out_path)

        vis_frames = sum(
            sum(1 for row in tr if row[1] is not None)
            for tr in shot_tracks.values()
        )
        tot_frames = sum(len(tr) for tr in shot_tracks.values())
        print(
            f"  [{idx}/{len(process_list)}] {sh['id']} ({sh['start']:.1f}..{sh['end']:.1f}s, "
            f"{len(frames)}f, {len(sh['entities'])} ents): {vis_frames}/{tot_frames} visible boxes in {time.time() - ts0:.2f}s",
            flush=True,
        )
        if strip_dir is not None:
            strip_path = render_strip(sh, shot_tracks, frames, times, strip_dir)
            if strip_path:
                print(f"    strip -> {strip_path}", flush=True)

    tmp = out_path.with_suffix(".tmp")
    tmp.write_text(json.dumps(merged, ensure_ascii=False), encoding="utf-8")
    tmp.replace(out_path)
    print(f"Saved {len(merged)} SAM 2 entity trajectories -> {out_path.relative_to(ROOT.parent)}", flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
