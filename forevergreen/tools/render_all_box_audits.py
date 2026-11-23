#!/usr/bin/env python3
"""Render 10x10-gridded bounding-box audit sheets for all 150 Busy-Picture scenes."""

from __future__ import annotations

import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
VIDEO_PATH = ROOT / "video" / "forevergreen.mp4"
SCENE_ITEMS_JS = ROOT / "scene-items.js"

SCRATCH_ROOT = Path("/Users/timothyhall/.gemini/antigravity/brain/87f8e142-20ff-4c76-8e59-44070b5e1fb0/scratch")
GRID_S_DIR = SCRATCH_ROOT / "fg-shots91"
GRID_X_DIR = SCRATCH_ROOT / "fg-missing-shots"
OUT_DIR = SCRATCH_ROOT / "fg-box-audit"

COLORS = ["cyan", "yellow", "lime", "magenta", "orange", "white", "deepskyblue", "springgreen"]


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


def ensure_base_grid(sc: dict) -> Path:
    sid = sc["id"]
    if sid.startswith("s"):
        src = GRID_S_DIR / f"{sid}.jpg"
    else:
        src = GRID_X_DIR / f"{sid}.jpg"
    if src.exists():
        return src
    src.parent.mkdir(parents=True, exist_ok=True)
    mm = int(sc["frameSec"]) // 60
    ss = int(sc["frameSec"]) % 60
    vf = build_grid_filter(f"{sid} {mm}m{ss:02d}s ({sc['frameSec']}s)")
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
            str(src),
        ],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    return src


def source_json_for_scene(sc: dict) -> str:
    sid = sc["id"]
    if sid.startswith("s"):
        return f"scenes_act{sc['act']}.json"
    num = int(sid[1:])
    if num <= 12:
        b = 1
    elif num <= 24:
        b = 2
    elif num <= 36:
        b = 3
    elif num <= 48:
        b = 4
    else:
        b = 5
    return f"scenes_missing_b{b}.json"


def render_overlay_panel(sc: dict) -> Path:
    base = ensure_base_grid(sc)
    dst = OUT_DIR / f"panel_{sc['id']}.jpg"
    filters = []
    for idx, item in enumerate(sc["items"]):
        ymin, xmin, ymax, xmax = item["box"]
        x = int(round(xmin * 640 / 1000.0))
        y = int(round(ymin * 360 / 1000.0))
        w = max(4, int(round((xmax - xmin) * 640 / 1000.0)))
        h = max(4, int(round((ymax - ymin) * 360 / 1000.0)))
        col = COLORS[idx % len(COLORS)]
        filters.append(f"drawbox=x={x}:y={y}:w={w}:h={h}:color={col}@0.92:t=2")
        safe_name = item["name"].replace(":", "").replace("'", "")
        ly = min(344, max(16, y + 2))
        filters.append(
            f"drawtext=text='{idx+1}.{safe_name}':x={min(540, x+2)}:y={ly}:fontsize=11:fontcolor={col}:box=1:boxcolor=black@0.8"
        )
    subprocess.run(
        ["ffmpeg", "-y", "-i", str(base), "-vf", ",".join(filters), "-q:v", "3", str(dst)],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    return dst


def main() -> int:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    scenes = load_compiled_scenes()
    panels = [(sc, render_overlay_panel(sc)) for sc in scenes]

    sheets_meta = []
    chunks = [panels[i : i + 6] for i in range(0, len(panels), 6)]
    for s_idx, chunk in enumerate(chunks, 1):
        out_name = f"audit_{s_idx:02d}.jpg"
        out_path = OUT_DIR / out_name
        if len(chunk) == 1:
            subprocess.run(["cp", str(chunk[0][1]), str(out_path)], check=True)
        else:
            inputs = []
            layouts = []
            for idx, (_, p) in enumerate(chunk):
                inputs += ["-i", str(p)]
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
        sheets_meta.append({
            "sheet": out_name,
            "path": str(out_path),
            "scenes": [
                {
                    "id": sc["id"],
                    "act": sc["act"],
                    "frameSec": sc["frameSec"],
                    "sourceFile": source_json_for_scene(sc),
                    "itemCount": len(sc["items"]),
                }
                for sc, _ in chunk
            ],
        })

    index_path = OUT_DIR / "audit_index.json"
    index_path.write_text(json.dumps({"totalScenes": len(scenes), "sheets": sheets_meta}, indent=2), encoding="utf-8")
    print(f"Rendered {len(sheets_meta)} audit sheets ({len(scenes)} scenes) -> {OUT_DIR}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
