#!/usr/bin/env python3
"""Detect exact camera shots in Forevergreen and extract 10x10 gridded Act sheets via ffmpeg."""

from __future__ import annotations

import json
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
VIDEO_PATH = ROOT / "video" / "forevergreen.mp4"
MANIFEST_PATH = ROOT / "production" / "shot-manifest.json"
OUT_DIR = Path(
    "/Users/timothyhall/.gemini/antigravity/brain/87f8e142-20ff-4c76-8e59-44070b5e1fb0/scratch/fg-shots91"
)


def detect_shots() -> list[dict]:
    proc = subprocess.run(
        [
            "ffmpeg",
            "-i",
            str(VIDEO_PATH),
            "-t",
            "722",
            "-vf",
            "select='gt(scene,0.20)',showinfo",
            "-f",
            "null",
            "-",
        ],
        capture_output=True,
        text=True,
        check=True,
    )
    pts = [round(float(m.group(1)), 1) for m in re.finditer(r"pts_time:([0-9.]+)", proc.stderr)]
    cuts = [0.0, 15.0]
    for t in pts:
        if 18.0 <= t <= 718.0 and t - cuts[-1] >= 3.2:
            cuts.append(t)

    bounds = cuts + [721.0]
    refined = []
    for a, b in zip(bounds[:-1], bounds[1:]):
        refined.append(a)
        if b - a > 18.0:
            n = int((b - a) // 12) + 1
            for k in range(1, n):
                refined.append(round(a + (b - a) * k / n, 1))
    refined.append(721.0)

    shots = []
    total = len(refined) - 1
    for i in range(total):
        start = round(refined[i], 1)
        end = round(refined[i + 1], 1)
        mid = round((start + end) / 2.0, 1)
        if i == 0:
            mid = 11.5
        elif i == total - 1:
            mid = 716.0

        if mid < 126:
            act = 1
        elif mid <= 319:
            act = 2
        elif mid <= 435:
            act = 3
        elif mid <= 566:
            act = 4
        else:
            act = 5

        shots.append({
            "id": f"s{i + 1:02d}",
            "index": i + 1,
            "act": act,
            "start": start,
            "end": end,
            "frameSec": mid,
        })
    return shots


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


def pack_act_sheets(shots: list[dict]) -> dict[int, list[str]]:
    by_act: dict[int, list[dict]] = {1: [], 2: [], 3: [], 4: [], 5: []}
    for sc in shots:
        by_act[sc["act"]].append(sc)

    manifest_sheets: dict[int, list[str]] = {}
    for act_id, act_shots in by_act.items():
        manifest_sheets[act_id] = []
        chunks = [act_shots[i : i + 6] for i in range(0, len(act_shots), 6)]
        for c_idx, chunk in enumerate(chunks, 1):
            out_name = f"act{act_id}_{c_idx}.jpg"
            out_path = OUT_DIR / out_name
            if len(chunk) == 1:
                subprocess.run(
                    ["cp", str(OUT_DIR / f"{chunk[0]['id']}.jpg"), str(out_path)],
                    check=True,
                )
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
            manifest_sheets[act_id].append(out_name)
    return manifest_sheets


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    shots = detect_shots()

    for sc in shots:
        img_path = OUT_DIR / f"{sc['id']}.jpg"
        mm = int(sc["frameSec"]) // 60
        ss = int(sc["frameSec"]) % 60
        vf = build_grid_filter(f"#{sc['index']:02d} {mm}m{ss:02d}s ({sc['frameSec']}s)")
        subprocess.run(
            [
                "ffmpeg",
                "-y",
                "-ss",
                str(sc["frameSec"]),
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

    sheets = pack_act_sheets(shots)
    MANIFEST_PATH.parent.mkdir(parents=True, exist_ok=True)
    MANIFEST_PATH.write_text(
        json.dumps({"totalShots": len(shots), "sheets": sheets, "shots": shots}, indent=2),
        encoding="utf-8",
    )
    print(f"Wrote {len(shots)} shots -> {MANIFEST_PATH.relative_to(ROOT.parent)}")
    for act_id, names in sheets.items():
        act_shots = [s["id"] for s in shots if s["act"] == act_id]
        print(f"  Act {act_id}: {len(act_shots)} shots ({act_shots[0]}..{act_shots[-1]}), sheets: {names}")


if __name__ == "__main__":
    main()
