#!/usr/bin/env python3
"""Offline 4-fps FFT phase-correlation + anchored 4ch-NCC tracker for Busy-Picture items."""

from __future__ import annotations

import argparse
import json
import subprocess
from concurrent.futures import ProcessPoolExecutor
from pathlib import Path

import numpy as np
import torch
import torch.nn.functional as F

ROOT = Path(__file__).resolve().parent.parent
VIDEO_PATH = ROOT / "video" / "forevergreen.mp4"
SCENE_ITEMS_JS = ROOT / "scene-items.js"
TRACKS_PATH = ROOT / "production" / "scene-tracks.json"
CHECK_DIR = Path(
    "/Users/timothyhall/.gemini/antigravity/brain/87f8e142-20ff-4c76-8e59-44070b5e1fb0/scratch/fg-track-check"
)

TRACK_W = 320
TRACK_H = 180
FPS = 4
DT = 1.0 / FPS

ACTIVE_YMIN_NORM = 115
ACTIVE_YMAX_NORM = 885
ACTIVE_Y0_PX = int(round(ACTIVE_YMIN_NORM * TRACK_H / 1000.0))  # 21
ACTIVE_Y1_PX = int(round(ACTIVE_YMAX_NORM * TRACK_H / 1000.0))  # 159

SEARCH_RX = 26
SEARCH_RY = 18


def load_compiled_scenes() -> list[dict]:
    raw = subprocess.check_output(
        [
            "node",
            "-e",
            f"const {{ FOREVERGREEN_SCENES }} = require({json.dumps(str(SCENE_ITEMS_JS))});"
            "process.stdout.write(JSON.stringify(FOREVERGREEN_SCENES));",
        ],
        text=True,
    )
    return json.loads(raw)


def decode_scene_frames(start: float, end: float) -> tuple[np.ndarray, list[float]]:
    dur = max(0.35, (end - start) + 0.15)
    raw = subprocess.check_output(
        [
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
            f"fps={FPS}:round=near,scale={TRACK_W}:{TRACK_H}",
            "-f",
            "rawvideo",
            "-pix_fmt",
            "rgb24",
            "-",
        ]
    )
    frame_bytes = TRACK_W * TRACK_H * 3
    n = len(raw) // frame_bytes
    if n <= 0:
        return np.zeros((0, TRACK_H, TRACK_W, 3), dtype=np.uint8), []
    arr = np.frombuffer(raw[: n * frame_bytes], dtype=np.uint8).reshape((n, TRACK_H, TRACK_W, 3))
    times = [min(end, round(start + k * DT, 2)) for k in range(n)]
    # Ensure strictly increasing timestamps in case last clipped frame equals previous
    for k in range(1, len(times)):
        if times[k] <= times[k - 1]:
            times[k] = round(times[k - 1] + 0.05, 2)
    return arr, times


def frame_features(rgb_frames: np.ndarray) -> torch.Tensor:
    """Build (N, 4, H, W) float32 tensor [R, G, B, edge_mag] in 0..1."""
    arr = rgb_frames.astype(np.float32) / 255.0  # (N, H, W, 3)
    luma = 0.299 * arr[..., 0] + 0.587 * arr[..., 1] + 0.114 * arr[..., 2]
    dx = np.zeros_like(luma)
    dy = np.zeros_like(luma)
    dx[:, :, 1:] = luma[:, :, 1:] - luma[:, :, :-1]
    dy[:, 1:, :] = luma[:, 1:, :] - luma[:, :-1, :]
    edge = np.clip(np.hypot(dx, dy) * 2.5, 0.0, 1.0)
    feat = np.concatenate([arr, edge[..., None]], axis=-1)  # (N, H, W, 4)
    return torch.from_numpy(np.ascontiguousarray(feat.transpose(0, 3, 1, 2)))


def phase_corr_shift(src_f: np.ndarray, dst_f: np.ndarray, hann: np.ndarray) -> tuple[float, float, float]:
    """Estimate (dx, dy) shift of content from src_f -> dst_f via FFT phase correlation."""
    f1 = np.fft.rfft2(src_f * hann)
    f2 = np.fft.rfft2(dst_f * hann)
    cross = f2 * np.conj(f1)
    denom = np.abs(cross) + 1e-8
    corr = np.fft.irfft2(cross / denom, s=src_f.shape)
    h, w = corr.shape
    py, px = np.unravel_index(np.argmax(corr), corr.shape)
    peak = float(corr[py, px])
    dy = float(py if py <= h // 2 else py - h)
    dx = float(px if px <= w // 2 else px - w)
    # Reject implausible teleport spikes > 45px per 0.25s step
    if abs(dx) > 45 or abs(dy) > 35:
        return 0.0, 0.0, 0.0
    return dx, dy, peak


def compute_global_shifts(rgb_frames: np.ndarray) -> tuple[list[tuple[float, float]], list[float]]:
    n = len(rgb_frames)
    if n <= 1:
        return [], []
    roi = rgb_frames[:, ACTIVE_Y0_PX:ACTIVE_Y1_PX, :, :].astype(np.float32) / 255.0
    luma = 0.299 * roi[..., 0] + 0.587 * roi[..., 1] + 0.114 * roi[..., 2]
    h, w = luma.shape[1], luma.shape[2]
    hann = np.outer(np.hanning(h), np.hanning(w)).astype(np.float32)

    shifts: list[tuple[float, float]] = []
    mads: list[float] = []
    for k in range(n - 1):
        mad = float(np.mean(np.abs(rgb_frames[k + 1, ACTIVE_Y0_PX:ACTIVE_Y1_PX].astype(np.float32) -
                                    rgb_frames[k, ACTIVE_Y0_PX:ACTIVE_Y1_PX].astype(np.float32))))
        dx, dy, peak = phase_corr_shift(luma[k], luma[k + 1], hann)
        if peak < 0.05:
            dx, dy = 0.0, 0.0
        shifts.append((dx, dy))
        mads.append(mad)
    return shifts, mads


def norm_to_px_box(box: list[int]) -> tuple[int, int, int, int]:
    ymin, xmin, ymax, xmax = box
    x0 = int(round(xmin * TRACK_W / 1000.0))
    y0 = int(round(ymin * TRACK_H / 1000.0))
    x1 = max(x0 + 6, int(round(xmax * TRACK_W / 1000.0)))
    y1 = max(y0 + 6, int(round(ymax * TRACK_H / 1000.0)))
    x0 = max(0, min(TRACK_W - 6, x0))
    y0 = max(0, min(TRACK_H - 6, y0))
    x1 = max(x0 + 6, min(TRACK_W, x1))
    y1 = max(y0 + 6, min(TRACK_H, y1))
    return x0, y0, x1, y1


def px_to_norm_box(cx: float, cy: float, w_px: float, h_px: float) -> list[int] | None:
    x0 = cx - w_px / 2.0
    y0 = cy - h_px / 2.0
    x1 = cx + w_px / 2.0
    y1 = cy + h_px / 2.0

    # Clip to active picture bounds
    cx_norm = cx * 1000.0 / TRACK_W
    cy_norm = cy * 1000.0 / TRACK_H
    if cx_norm < 12.0 or cx_norm > 988.0 or cy_norm < ACTIVE_YMIN_NORM or cy_norm > ACTIVE_YMAX_NORM:
        return None

    vx0 = max(0.0, x0)
    vx1 = min(float(TRACK_W), x1)
    vy0 = max(float(ACTIVE_Y0_PX), y0)
    vy1 = min(float(ACTIVE_Y1_PX), y1)
    vis_area = max(0.0, vx1 - vx0) * max(0.0, vy1 - vy0)
    orig_area = max(1.0, w_px * h_px)
    if vis_area / orig_area < 0.40:
        return None

    ymin = int(round(max(float(ACTIVE_YMIN_NORM), vy0 * 1000.0 / TRACK_H)))
    ymax = int(round(min(float(ACTIVE_YMAX_NORM), vy1 * 1000.0 / TRACK_H)))
    xmin = int(round(max(0.0, vx0 * 1000.0 / TRACK_W)))
    xmax = int(round(min(1000.0, vx1 * 1000.0 / TRACK_W)))
    if ymax - ymin < 12 or xmax - xmin < 12:
        return None
    return [ymin, xmin, ymax, xmax]


def ncc_map(search_patch: torch.Tensor, tmpl: torch.Tensor) -> torch.Tensor:
    """Compute per-channel zero-mean ZNCC with RGB color-similarity gate."""
    _, c, th, tw = tmpl.shape
    area = float(th * tw)
    tm = tmpl.mean(dim=(2, 3), keepdim=True)
    tz = tmpl - tm
    tnorm = torch.sqrt((tz * tz).sum(dim=(2, 3), keepdim=True) + 1e-6)

    w_ones = torch.ones((c, 1, th, tw), dtype=tmpl.dtype)
    sp = F.conv2d(search_patch, w_ones, groups=c)
    sp2 = F.conv2d(search_patch * search_patch, w_ones, groups=c)
    cross = F.conv2d(search_patch, tz.transpose(0, 1), groups=c)

    var_p = torch.clamp(sp2 - (sp * sp) / area, min=1e-4)
    zncc_c = cross / (torch.sqrt(var_p) * tnorm.view(1, c, 1, 1))
    # Weight RGB higher than sparse gradient edge channel
    weights = torch.tensor([0.30, 0.30, 0.30, 0.10], dtype=tmpl.dtype).view(1, c, 1, 1)
    zncc_weighted = (zncc_c * weights).sum(dim=1)

    mean_p_rgb = sp[:, :3] / area
    mean_t_rgb = tm[:, :3]
    color_diff = torch.abs(mean_p_rgb - mean_t_rgb).mean(dim=1)
    color_gate = torch.exp(-color_diff * 3.0)
    return (zncc_weighted * color_gate)[0]  # (Hs - th + 1, Ws - tw + 1)


def simplify_polyline(points: list[tuple[float, list[int]]], eps: float = 10.0) -> list[list]:
    """RDP-like simplification on [t, ymin, xmin, ymax, xmax] keeping endpoints."""
    if len(points) <= 2:
        return [[t] + b for t, b in points]

    t0, b0 = points[0]
    t1, b1 = points[-1]
    span = max(1e-5, t1 - t0)
    max_err = -1.0
    max_idx = -1
    for i in range(1, len(points) - 1):
        ti, bi = points[i]
        u = (ti - t0) / span
        err = max(abs(bi[c] - (b0[c] + u * (b1[c] - b0[c]))) for c in range(4))
        if err > max_err:
            max_err = err
            max_idx = i
    if max_err <= eps:
        return [[t0] + b0, [t1] + b1]
    left = simplify_polyline(points[: max_idx + 1], eps)
    right = simplify_polyline(points[max_idx:], eps)
    return left[:-1] + right


def compress_track(times: list[float], boxes: list[list[int] | None], static_box: list[int]) -> list[list] | None:
    # Skip if all frames are visible and within ±14 normalized units of static_box
    if all(b is not None and max(abs(b[c] - static_box[c]) for c in range(4)) <= 14 for b in boxes):
        return None

    # Partition into contiguous runs of visible vs null
    out: list[list] = []
    i = 0
    n = len(times)
    while i < n:
        if boxes[i] is None:
            j = i
            while j + 1 < n and boxes[j + 1] is None:
                j += 1
            out.append([times[i], None])
            if j > i:
                out.append([times[j], None])
            i = j + 1
        else:
            j = i
            while j + 1 < n and boxes[j + 1] is not None:
                j += 1
            run = [(times[k], boxes[k]) for k in range(i, j + 1)]
            out.extend(simplify_polyline(run, eps=10.0))
            i = j + 1
    return out


def track_item(
    feats: torch.Tensor,
    times: list[float],
    ref_idx: int,
    shifts: list[tuple[float, float]],
    mads: list[float],
    static_box: list[int],
) -> list[list] | None:
    ymin, xmin, ymax, xmax = static_box
    n = feats.shape[0]
    if n <= 1:
        return None
    rx0, ry0, rx1, ry1 = norm_to_px_box(static_box)
    tw = rx1 - rx0
    th = ry1 - ry0
    ref_out = [
        max(ACTIVE_YMIN_NORM, ymin),
        max(0, xmin),
        min(ACTIVE_YMAX_NORM, ymax),
        min(1000, xmax),
    ]
    if (xmax - xmin) >= 720 and (ymax - ymin) >= 550:
        # Validate large backdrop items across dissolves via mean RGB diff vs reference box
        t_ref_rgb = feats[ref_idx : ref_idx + 1, :3, ry0:ry1, rx0:rx1]
        bg_boxes: list[list[int] | None] = []
        for idx in range(n):
            p_rgb = feats[idx : idx + 1, :3, ry0:ry1, rx0:rx1]
            diff = float(torch.abs(p_rgb - t_ref_rgb).mean().item())
            bg_boxes.append(ref_out if diff <= 0.16 else None)
        return compress_track(times, bg_boxes, ref_out)

    # Guard against oversized templates that leave no room inside frame
    if tw >= TRACK_W - 12 or th >= TRACK_H - 12:
        return None

    t_ref = feats[ref_idx : ref_idx + 1, :, ry0:ry1, rx0:rx1]
    ref_cx = (rx0 + rx1) / 2.0
    ref_cy = (ry0 + ry1) / 2.0

    tracked: list[list[int] | None] = [None] * n
    tracked[ref_idx] = ref_out

    t_ref_rgb = feats[ref_idx : ref_idx + 1, :3, ry0:ry1, rx0:rx1]

    for direction in (-1, 1):
        cx = ref_cx
        cy = ref_cy
        t_prev = t_ref
        lost = False
        idx = ref_idx + direction
        while 0 <= idx < n:
            step_idx = idx if direction == -1 else idx - 1
            mad = mads[step_idx]
            gdx, gdy = shifts[step_idx]
            if direction == -1:
                gdx, gdy = -gdx, -gdy

            if mad > 55.0 and abs(gdx) < 1.0 and abs(gdy) < 1.0:
                break

            pred_cx = cx + gdx
            pred_cy = cy + gdy

            sx0 = int(round(max(0.0, pred_cx - tw / 2.0 - SEARCH_RX)))
            sy0 = int(round(max(0.0, pred_cy - th / 2.0 - SEARCH_RY)))
            sx1 = int(round(min(float(TRACK_W), pred_cx + tw / 2.0 + SEARCH_RX)))
            sy1 = int(round(min(float(TRACK_H), pred_cy + th / 2.0 + SEARCH_RY)))

            if sx1 - sx0 < tw or sy1 - sy0 < th:
                tracked[idx] = None
                lost = True
                cx, cy = pred_cx, pred_cy
                idx += direction
                continue

            patch = feats[idx : idx + 1, :, sy0:sy1, sx0:sx1]
            s_ref = ncc_map(patch, t_ref)

            if lost:
                py, px = np.unravel_index(int(torch.argmax(s_ref).item()), s_ref.shape)
                best_ref = float(s_ref[py, px].item())
                bx0 = sx0 + px
                by0 = sy0 + py
                cand_rgb = feats[idx : idx + 1, :3, by0 : by0 + th, bx0 : bx0 + tw]
                rgb_diff = float(torch.abs(cand_rgb - t_ref_rgb).mean().item())
                if best_ref >= 0.62 and rgb_diff <= 0.12:
                    cx = bx0 + tw / 2.0
                    cy = by0 + th / 2.0
                    nb = px_to_norm_box(cx, cy, tw, th)
                    if nb is not None:
                        lost = False
                        tracked[idx] = nb
                        t_prev = feats[idx : idx + 1, :, by0 : by0 + th, bx0 : bx0 + tw]
                else:
                    cx, cy = pred_cx, pred_cy
                idx += direction
                continue

            s_prev = ncc_map(patch, t_prev)
            combined = 0.65 * s_ref + 0.35 * s_prev

            flat_idx = int(torch.argmax(combined).item())
            py, px = divmod(flat_idx, combined.shape[1])
            score_ref = float(s_ref[py, px].item())
            bx0 = sx0 + px
            by0 = sy0 + py
            cand_rgb = feats[idx : idx + 1, :3, by0 : by0 + th, bx0 : bx0 + tw]
            rgb_diff = float(torch.abs(cand_rgb - t_ref_rgb).mean().item())

            # Strict anti-hallucination gate: fail immediately on weak ref correlation or color mismatch
            if score_ref < 0.48 or rgb_diff > 0.14:
                tracked[idx] = None
                lost = True
                cx, cy = pred_cx, pred_cy
                idx += direction
                continue

            best_cx = bx0 + tw / 2.0
            best_cy = by0 + th / 2.0
            cx = 0.85 * best_cx + 0.15 * pred_cx
            cy = 0.85 * best_cy + 0.15 * pred_cy

            nb = px_to_norm_box(cx, cy, tw, th)
            if nb is None:
                tracked[idx] = None
                lost = True
                idx += direction
                continue

            tracked[idx] = nb
            bx_c = int(max(0, min(TRACK_W - tw, round(cx - tw / 2.0))))
            by_c = int(max(0, min(TRACK_H - th, round(cy - th / 2.0))))
            t_prev = feats[idx : idx + 1, :, by_c : by_c + th, bx_c : bx_c + tw]
            idx += direction

    return compress_track(times, tracked, ref_out)


def sample_track_box(track: list[list] | None, static_box: list[int], t: float) -> list[int] | None:
    if not track:
        return static_box
    if t <= track[0][0]:
        return None if track[0][1] is None else list(track[0][1:])
    if t >= track[-1][0]:
        return None if track[-1][1] is None else list(track[-1][1:])
    for i in range(len(track) - 1):
        a, b = track[i], track[i + 1]
        if a[0] <= t <= b[0]:
            if a[1] is None and b[1] is None:
                return None
            if a[1] is None:
                return list(b[1:]) if (b[0] - t) <= 0.12 else None
            if b[1] is None:
                return list(a[1:]) if (t - a[0]) <= 0.12 else None
            u = (t - a[0]) / max(1e-4, b[0] - a[0])
            return [int(round(a[c + 1] + u * (b[c + 1] - a[c + 1]))) for c in range(4)]
    return static_box


def render_verify_strip(sc: dict, tracks_map: dict[str, list[list]], out_path: Path) -> None:
    out_path.parent.mkdir(parents=True, exist_ok=True)
    # Sample up to 4 timestamps evenly inside [start+0.2, end-0.2], always including frameSec
    span = sc["end"] - sc["start"]
    if span <= 1.2:
        ts = [sc["frameSec"]]
    else:
        cand = [
            round(sc["start"] + 0.15 * span, 2),
            round(sc["start"] + 0.45 * span, 2),
            round(sc["frameSec"], 2),
            round(sc["start"] + 0.85 * span, 2),
        ]
        ts = []
        for t in sorted(set(cand)):
            if not ts or t - ts[-1] >= 0.4:
                ts.append(t)
        ts = ts[:4]

    if sc["id"] == "s38":
        ts = [271.0, 273.0, 274.5, 276.0]

    colors = ["cyan", "yellow", "lime", "magenta", "orange", "white", "deepskyblue", "springgreen"]
    panels = []
    for k, t in enumerate(ts):
        dst = out_path.parent / f"{sc['id']}_strip_{k}.jpg"
        filters = ["scale=640:360"]
        mm, ss = int(t) // 60, t % 60
        filters.append(
            f"drawtext=text='{sc['id']} {mm}m{ss:04.1f}s':x=8:y=6:fontsize=16:fontcolor=yellow:box=1:boxcolor=black@0.8"
        )
        for idx, it in enumerate(sc["items"]):
            box = sample_track_box(tracks_map.get(it["id"]), it["box"], t)
            if box is None:
                continue
            ymin, xmin, ymax, xmax = box
            x = int(round(xmin * 640 / 1000.0))
            y = int(round(ymin * 360 / 1000.0))
            w = max(4, int(round((xmax - xmin) * 640 / 1000.0)))
            h = max(4, int(round((ymax - ymin) * 360 / 1000.0)))
            col = colors[idx % len(colors)]
            filters.append(f"drawbox=x={x}:y={y}:w={w}:h={h}:color={col}@0.92:t=2")
            safe = it["name"].replace(":", "").replace("'", "")
            ly = max(18, min(344, y + 2))
            filters.append(
                f"drawtext=text='{safe}':x={min(540, x+2)}:y={ly}:fontsize=11:fontcolor={col}:box=1:boxcolor=black@0.8"
            )
        subprocess.run(
            [
                "ffmpeg",
                "-hide_banner",
                "-loglevel",
                "error",
                "-y",
                "-ss",
                f"{t:.2f}",
                "-i",
                str(VIDEO_PATH),
                "-frames:v",
                "1",
                "-vf",
                ",".join(filters),
                "-q:v",
                "3",
                str(dst),
            ],
            check=True,
        )
        panels.append(dst)

    if len(panels) == 1:
        subprocess.run(["cp", str(panels[0]), str(out_path)], check=True)
        return
    inputs = []
    layouts = []
    cols = 2 if len(panels) >= 2 else 1
    for i, p in enumerate(panels):
        inputs += ["-i", str(p)]
        r, c = divmod(i, cols)
        layouts.append(f"{'0' if c == 0 else 'w0'}_{'0' if r == 0 else 'h0'}")
    subprocess.run(
        ["ffmpeg", "-hide_banner", "-loglevel", "error", "-y"]
        + inputs
        + ["-filter_complex", f"xstack=inputs={len(panels)}:layout={'|'.join(layouts)}:fill=black", "-q:v", "3", str(out_path)],
        check=True,
    )


def _track_scene_worker(sc: dict) -> tuple[str, dict[str, list[list]]]:
    torch.set_num_threads(1)
    rgb, times = decode_scene_frames(float(sc["start"]), float(sc["end"]))
    if len(rgb) <= 1:
        return sc["id"], {}
    ref_idx = int(np.argmin([abs(t - float(sc["frameSec"])) for t in times]))
    shifts, mads = compute_global_shifts(rgb)
    feats = frame_features(rgb)
    out: dict[str, list[list]] = {}
    for it in sc["items"]:
        tr = track_item(feats, times, ref_idx, shifts, mads, it["box"])
        if tr:
            out[it["id"]] = tr
    return sc["id"], out


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--scenes", default="", help="Comma-separated scene IDs to track (default: all)")
    parser.add_argument("--workers", type=int, default=4, help="Parallel worker count")
    parser.add_argument("--verify-strip", default="", help="Optional strip output path for first matching scenes")
    args = parser.parse_args()

    scenes = load_compiled_scenes()
    selected = {s.strip() for s in args.scenes.split(",") if s.strip()}
    target_scenes = [sc for sc in scenes if sc["id"] in selected] if selected else scenes

    existing_tracks: dict[str, list[list]] = {}
    if selected and TRACKS_PATH.exists():
        existing_tracks = json.loads(TRACKS_PATH.read_text(encoding="utf-8"))

    tracks_out: dict[str, list[list]] = dict(existing_tracks) if selected else {}

    if args.workers <= 1 or len(target_scenes) <= 2:
        for i, sc in enumerate(target_scenes, 1):
            sid, sc_tracks = _track_scene_worker(sc)
            tracks_out.update(sc_tracks)
            if len(target_scenes) <= 10 or i % 15 == 0 or i == len(target_scenes):
                print(f"  [{i}/{len(target_scenes)}] {sid}: {len(sc_tracks)} tracked items", flush=True)
    else:
        with ProcessPoolExecutor(max_workers=args.workers) as pool:
            for i, (sid, sc_tracks) in enumerate(pool.map(_track_scene_worker, target_scenes), 1):
                tracks_out.update(sc_tracks)
                if i % 15 == 0 or i == len(target_scenes):
                    print(f"  [{i}/{len(target_scenes)}] {sid}: {len(sc_tracks)} tracked items", flush=True)

    if not selected:
        TRACKS_PATH.parent.mkdir(parents=True, exist_ok=True)
        TRACKS_PATH.write_text(json.dumps(tracks_out, separators=(",", ":")), encoding="utf-8")
        print(f"Wrote {len(tracks_out)} tracked item trajectories -> {TRACKS_PATH.relative_to(ROOT.parent)}")

    if args.verify_strip:
        if len(target_scenes) == 1:
            render_verify_strip(target_scenes[0], tracks_out, Path(args.verify_strip))
            print(f"Rendered strip -> {args.verify_strip}")
        else:
            out_dir = Path(args.verify_strip)
            for sc in target_scenes[:4]:
                p = out_dir / f"{sc['id']}_strip.jpg"
                render_verify_strip(sc, tracks_out, p)
                print(f"Rendered strip -> {p}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
