#!/usr/bin/env python3
"""Sync Busy-Picture scenes to exact ffmpeg camera cuts and extract missing-shot grids."""

from __future__ import annotations

import json
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
VIDEO_PATH = ROOT / "video" / "forevergreen.mp4"
PROD_DIR = ROOT / "production"
PLAN_PATH = PROD_DIR / "exact-shot-plan.json"
OUT_DIR = Path(
    "/Users/timothyhall/.gemini/antigravity/brain/87f8e142-20ff-4c76-8e59-44070b5e1fb0/scratch/fg-missing-shots"
)

STORY_END_SEC = 721.0
SCENE_THRESHOLD = 0.14
CLUSTER_GAP_SEC = 0.55
MIN_NEW_SHOT_SEC = 0.85
LONG_SINGLE_SPLIT_SEC = 12.5


def act_for_sec(t: float) -> int:
    if t < 126.0:
        return 1
    if t <= 319.0:
        return 2
    if t <= 435.0:
        return 3
    if t <= 566.0:
        return 4
    return 5


def detect_real_cuts() -> list[float]:
    proc = subprocess.run(
        [
            "ffmpeg",
            "-i",
            str(VIDEO_PATH),
            "-t",
            "722",
            "-vf",
            f"select='gt(scene,{SCENE_THRESHOLD})',showinfo",
            "-f",
            "null",
            "-",
        ],
        capture_output=True,
        text=True,
        check=True,
    )
    raw = [round(float(m.group(1)), 2) for m in re.finditer(r"pts_time:([0-9.]+)", proc.stderr)]
    cuts: list[float] = []
    for t in raw:
        if not cuts or t - cuts[-1] >= CLUSTER_GAP_SEC:
            cuts.append(t)
    return cuts


def grab_small_rgb(t: float) -> bytes:
    clamped = max(0.0, min(STORY_END_SEC - 0.1, t))
    return subprocess.check_output(
        [
            "ffmpeg",
            "-hide_banner",
            "-loglevel",
            "error",
            "-ss",
            f"{clamped:.2f}",
            "-i",
            str(VIDEO_PATH),
            "-frames:v",
            "1",
            "-vf",
            "scale=64:36",
            "-f",
            "rawvideo",
            "-pix_fmt",
            "rgb24",
            "-",
        ]
    )


def mad_rgb(a: bytes, b: bytes) -> float:
    return sum(abs(x - y) for x, y in zip(a, b)) / max(1, len(a))


def load_existing_scenes() -> list[dict]:
    scenes: list[dict] = []
    for act_id in range(1, 6):
        p = PROD_DIR / f"scenes_act{act_id}.json"
        scenes.extend(json.loads(p.read_text(encoding="utf-8")))
    scenes.sort(key=lambda s: float(s["start"]))
    return scenes


def nudge_inside(fs: float, start: float, end: float) -> float:
    span = end - start
    margin = min(0.15, max(0.05, span * 0.15))
    lo = start + margin
    hi = end - margin
    if lo > hi:
        return round((start + end) / 2.0, 2)
    return round(min(max(fs, lo), hi), 2)


def build_grid_filter(label: str) -> str:
    parts = [
        "scale=640:360",
        "drawgrid=w=32:h=36:t=1:c=cyan@0.20",
        "drawgrid=w=64:h=36:t=1:c=cyan@0.55",
    ]
    for k in range(10):
        x = k * 64 + 3
        parts.append(f"drawtext=text='{k}':x={x}:y=2:fontsize=13:fontcolor=white:box=1:boxcolor=black@0.72")
    for k in range(1, 10):
        y = k * 36 + 2
        parts.append(f"drawtext=text='{k}':x=3:y={y}:fontsize=13:fontcolor=white:box=1:boxcolor=black@0.72")
    safe_label = label.replace(":", "")
    parts.append(
        f"drawtext=text='{safe_label}':x=w-tw-8:y=6:fontsize=16:fontcolor=yellow:box=1:boxcolor=black@0.82"
    )
    return ",".join(parts)


def extract_and_pack_sheets(missing_shots: list[dict], batches: list[list[dict]]) -> dict[str, list[str]]:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for sc in missing_shots:
        img_path = OUT_DIR / f"{sc['id']}.jpg"
        mm = int(sc["frameSec"]) // 60
        ss = int(sc["frameSec"]) % 60
        vf = build_grid_filter(f"{sc['id']} {mm}m{ss:02d}s ({sc['frameSec']}s)")
        subprocess.run(
            [
                "ffmpeg",
                "-y",
                "-ss",
                f"{sc['frameSec']:.2f}",
                "-i",
                str(VIDEO_PATH),
                "-frames:v",
                "1",
                "-vf",
                vf,
                "-q:v",
                "3",
                str(img_path),
            ],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )

    batch_sheets: dict[str, list[str]] = {}
    for b_idx, b_shots in enumerate(batches, 1):
        b_key = f"b{b_idx}"
        batch_sheets[b_key] = []
        chunks = [b_shots[i : i + 6] for i in range(0, len(b_shots), 6)]
        for c_idx, chunk in enumerate(chunks, 1):
            out_name = f"missing_b{b_idx}_{c_idx}.jpg"
            out_path = OUT_DIR / out_name
            if len(chunk) == 1:
                subprocess.run(["cp", str(OUT_DIR / f"{chunk[0]['id']}.jpg"), str(out_path)], check=True)
            else:
                inputs = []
                layouts = []
                for idx, sc in enumerate(chunk):
                    inputs += ["-i", str(OUT_DIR / f"{sc['id']}.jpg")]
                    r, c = divmod(idx, 2)
                    x_expr = "0" if c == 0 else "w0"
                    y_expr = "0" if r == 0 else ("h0" if r == 1 else "h0+h2")
                    layouts.append(f"{x_expr}_{y_expr}")
                fc = f"xstack=inputs={len(chunk)}:layout={'|'.join(layouts)}:fill=black"
                subprocess.run(
                    ["ffmpeg", "-y"] + inputs + ["-filter_complex", fc, "-q:v", "3", str(out_path)],
                    check=True,
                    stdout=subprocess.DEVNULL,
                    stderr=subprocess.DEVNULL,
                )
            batch_sheets[b_key].append(out_name)
    return batch_sheets


def main() -> int:
    existing = load_existing_scenes()
    cuts = detect_real_cuts()
    bounds = [0.0] + [t for t in cuts if 14.0 < t < 720.5] + [STORY_END_SEC]
    real_shots = list(zip(bounds[:-1], bounds[1:]))

    # Map every existing scene onto the real shot containing its frameSec
    shot_buckets: list[list[dict]] = [[] for _ in real_shots]
    for sc in existing:
        fs = float(sc["frameSec"])
        placed = False
        for i, (a, b) in enumerate(real_shots):
            is_last = i == len(real_shots) - 1
            if a <= fs and (fs <= b if is_last else fs < b):
                shot_buckets[i].append(sc)
                placed = True
                break
        if not placed:
            raise RuntimeError(f"Could not place existing scene {sc['id']} (frameSec={fs}) into any real shot!")

    assert sum(len(b) for b in shot_buckets) == len(existing), "Existing scene count mismatch"

    # Build partition segments
    segments: list[dict] = []
    for i, (a, b) in enumerate(real_shots):
        bucket = sorted(shot_buckets[i], key=lambda s: float(s["frameSec"]))
        if len(bucket) == 0:
            if (b - a) >= MIN_NEW_SHOT_SEC:
                fs = round((a + b) / 2.0, 2)
                segments.append({
                    "kind": "missing",
                    "start": round(a, 2),
                    "end": round(b, 2),
                    "frameSec": fs,
                })
            else:
                segments.append({
                    "kind": "tiny",
                    "start": round(a, 2),
                    "end": round(b, 2),
                    "frameSec": round((a + b) / 2.0, 2),
                })
        elif len(bucket) == 1:
            sc = bucket[0]
            fs = float(sc["frameSec"])
            if (b - a) > LONG_SINGLE_SPLIT_SEC and sc["id"] != "s01":
                # Split long non-title shot cleanly without cutting too close to existing frameSec
                mid = (a + b) / 2.0
                if abs(fs - mid) < 1.2:
                    # Place split ~35% from a if fs >= mid, else ~65% from a
                    split_pt = round(a + (b - a) * (0.35 if fs >= mid else 0.65), 2)
                else:
                    split_pt = round(mid, 2)
                if fs < split_pt:
                    segments.append({
                        "kind": "existing",
                        "id": sc["id"],
                        "start": round(a, 2),
                        "end": split_pt,
                        "frameSec": nudge_inside(fs, a, split_pt),
                    })
                    segments.append({
                        "kind": "missing",
                        "start": split_pt,
                        "end": round(b, 2),
                        "frameSec": round((split_pt + b) / 2.0, 2),
                    })
                else:
                    segments.append({
                        "kind": "missing",
                        "start": round(a, 2),
                        "end": split_pt,
                        "frameSec": round((a + split_pt) / 2.0, 2),
                    })
                    segments.append({
                        "kind": "existing",
                        "id": sc["id"],
                        "start": split_pt,
                        "end": round(b, 2),
                        "frameSec": nudge_inside(fs, split_pt, b),
                    })
            else:
                segments.append({
                    "kind": "existing",
                    "id": sc["id"],
                    "start": round(a, 2),
                    "end": round(b, 2),
                    "frameSec": nudge_inside(fs, a, b),
                })
        else:
            split_pts = [a]
            for j in range(len(bucket) - 1):
                split_pts.append(round((float(bucket[j]["frameSec"]) + float(bucket[j + 1]["frameSec"])) / 2.0, 2))
            split_pts.append(b)
            for j, sc in enumerate(bucket):
                sa, sb = split_pts[j], split_pts[j + 1]
                segments.append({
                    "kind": "existing",
                    "id": sc["id"],
                    "start": round(sa, 2),
                    "end": round(sb, 2),
                    "frameSec": nudge_inside(float(sc["frameSec"]), sa, sb),
                })

    # Absorb any tiny (< 0.85s) uncovered fragments into adjacent non-tiny neighbor by lowest RGB MAD
    changed = True
    while changed:
        changed = False
        for idx, seg in enumerate(segments):
            if seg["kind"] != "tiny":
                continue
            prev_seg = segments[idx - 1] if idx > 0 and segments[idx - 1]["kind"] != "tiny" else None
            next_seg = segments[idx + 1] if idx + 1 < len(segments) and segments[idx + 1]["kind"] != "tiny" else None
            if prev_seg and next_seg:
                tiny_rgb = grab_small_rgb(seg["frameSec"])
                d_prev = mad_rgb(tiny_rgb, grab_small_rgb(prev_seg["frameSec"]))
                d_next = mad_rgb(tiny_rgb, grab_small_rgb(next_seg["frameSec"]))
                if d_prev <= d_next:
                    prev_seg["end"] = seg["end"]
                else:
                    next_seg["start"] = seg["start"]
                segments.pop(idx)
                changed = True
                break
            elif prev_seg:
                prev_seg["end"] = seg["end"]
                segments.pop(idx)
                changed = True
                break
            elif next_seg:
                next_seg["start"] = seg["start"]
                segments.pop(idx)
                changed = True
                break
            else:
                # Merge with adjacent tiny segment first
                if idx + 1 < len(segments):
                    seg["end"] = segments[idx + 1]["end"]
                    seg["frameSec"] = round((seg["start"] + seg["end"]) / 2.0, 2)
                    if seg["end"] - seg["start"] >= MIN_NEW_SHOT_SEC:
                        seg["kind"] = "missing"
                    segments.pop(idx + 1)
                    changed = True
                    break

    # Verify timeline contiguity & frameSec containment
    assert segments[0]["start"] == 0.0
    assert segments[-1]["end"] == STORY_END_SEC
    for i, seg in enumerate(segments):
        assert seg["kind"] in ("existing", "missing")
        assert seg["start"] <= seg["frameSec"] <= seg["end"], f"Bad segment {seg}"
        if i > 0:
            assert abs(seg["start"] - segments[i - 1]["end"]) < 0.02, f"Discontinuity at {i}: {segments[i-1]} -> {seg}"

    clamped_existing: dict[str, dict] = {}
    missing_shots: list[dict] = []
    m_idx = 0
    for seg in segments:
        if seg["kind"] == "existing":
            clamped_existing[seg["id"]] = {
                "start": seg["start"],
                "end": seg["end"],
                "frameSec": seg["frameSec"],
            }
        else:
            m_idx += 1
            fs = seg["frameSec"]
            missing_shots.append({
                "id": f"x{m_idx:02d}",
                "index": m_idx,
                "act": act_for_sec(fs),
                "start": seg["start"],
                "end": seg["end"],
                "frameSec": fs,
            })

    assert len(clamped_existing) == len(existing), "Lost existing scenes!"

    # Partition missing_shots into 5 balanced batches for visual annotation
    n_batches = 5
    q, r = divmod(len(missing_shots), n_batches)
    batches: list[list[dict]] = []
    cur = 0
    for b in range(n_batches):
        size = q + (1 if b < r else 0)
        batches.append(missing_shots[cur : cur + size])
        cur += size

    batch_sheets = extract_and_pack_sheets(missing_shots, batches)
    plan = {
        "totalRealShots": len(real_shots),
        "existingCount": len(clamped_existing),
        "missingCount": len(missing_shots),
        "totalScenes": len(clamped_existing) + len(missing_shots),
        "clampedExisting": clamped_existing,
        "missingShots": missing_shots,
        "batches": {
            f"b{idx + 1}": {
                "shotIds": [s["id"] for s in b_shots],
                "sheets": batch_sheets[f"b{idx + 1}"],
            }
            for idx, b_shots in enumerate(batches)
        },
    }
    PLAN_PATH.write_text(json.dumps(plan, indent=2), encoding="utf-8")
    print(
        f"Synced {plan['existingCount']} existing + {plan['missingCount']} missing = "
        f"{plan['totalScenes']} contiguous scenes (from {len(real_shots)} real shots) -> {PLAN_PATH.relative_to(ROOT.parent)}"
    )
    for b_key, b_info in plan["batches"].items():
        print(f"  Batch {b_key}: {len(b_info['shotIds'])} shots ({b_info['shotIds'][0]}..{b_info['shotIds'][-1]}), sheets: {b_info['sheets']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
