#!/usr/bin/env python3
"""Split moving/dissolving shots into adaptive pose keyframes and extract 10x10 cyan gridded sheets."""

from __future__ import annotations

import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
VIDEO_PATH = ROOT / "video" / "forevergreen.mp4"
PROD_DIR = ROOT / "production"
SHOT_PLAN_PATH = PROD_DIR / "exact-shot-plan.json"
OUT_PLAN_PATH = PROD_DIR / "exact-pose-plan.json"
OUT_DIR = Path(
    "/Users/timothyhall/.gemini/antigravity/brain/87f8e142-20ff-4c76-8e59-44070b5e1fb0/scratch/fg-pose-keyframes"
)

STORY_END_SEC = 721.0
MAD_THRESHOLD = 18.0
MIN_KF_SEP_SEC = 1.8


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


def load_base_scenes() -> list[dict]:
    plan = json.loads(SHOT_PLAN_PATH.read_text(encoding="utf-8"))
    clamped = plan["clampedExisting"]
    expected_missing = {m["id"]: m for m in plan["missingShots"]}

    scenes: list[dict] = []
    for act_id in range(1, 6):
        data = json.loads((PROD_DIR / f"scenes_act{act_id}.json").read_text(encoding="utf-8"))
        for sc in data:
            c = clamped[sc["id"]]
            scenes.append({
                "id": sc["id"],
                "act": sc["act"],
                "start": float(c["start"]),
                "end": float(c["end"]),
                "frameSec": float(c["frameSec"]),
                "title": sc.get("title", ""),
            })
    for m_path in sorted(PROD_DIR.glob("scenes_missing_b*.json")):
        data = json.loads(m_path.read_text(encoding="utf-8"))
        for sc in data:
            m = expected_missing[sc["id"]]
            scenes.append({
                "id": sc["id"],
                "act": int(m["act"]),
                "start": float(m["start"]),
                "end": float(m["end"]),
                "frameSec": float(m["frameSec"]),
                "title": sc.get("title", ""),
            })
    scenes.sort(key=lambda s: s["start"])
    assert len(scenes) == 150, f"Expected 150 base scenes, got {len(scenes)}"
    return scenes


def decode_2fps_active() -> list[bytes]:
    raw = subprocess.check_output(
        [
            "ffmpeg",
            "-hide_banner",
            "-loglevel",
            "error",
            "-i",
            str(VIDEO_PATH),
            "-t",
            "722",
            "-vf",
            "fps=2,scale=64:36",
            "-f",
            "rawvideo",
            "-pix_fmt",
            "rgb24",
            "-",
        ]
    )
    w, h = 64, 36
    fbytes = w * h * 3
    n = len(raw) // fbytes
    frames: list[bytes] = []
    row_lo = 4 * w * 3
    row_hi = 32 * w * 3
    for k in range(n):
        off = k * fbytes
        frames.append(raw[off + row_lo : off + row_hi])
    return frames


def mad(a: bytes, b: bytes) -> float:
    return sum(abs(x - y) for x, y in zip(a, b)) / len(a)


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


def extract_and_pack(pose_shots: list[dict], batches: list[list[dict]]) -> dict[str, list[str]]:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for sc in pose_shots:
        img_path = OUT_DIR / f"{sc['id']}.jpg"
        mm = int(sc["frameSec"]) // 60
        ss = int(sc["frameSec"]) % 60
        vf = build_grid_filter(f"{sc['id']}({sc['parentSceneId']}) {mm}m{ss:02d}s ({sc['frameSec']})")
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
        b_key = f"pb{b_idx}"
        batch_sheets[b_key] = []
        chunks = [b_shots[i : i + 6] for i in range(0, len(b_shots), 6)]
        for c_idx, chunk in enumerate(chunks, 1):
            out_name = f"pose_{b_key}_{c_idx}.jpg"
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
    base_scenes = load_base_scenes()
    frames = decode_2fps_active()
    n_frames = len(frames)

    def frame_at(t: float) -> bytes:
        k = max(0, min(n_frames - 1, int(round(t * 2.0))))
        return frames[k]

    clamped_all: dict[str, dict] = {}
    pose_shots: list[dict] = []
    p_counter = 0

    for sc in base_scenes:
        sid = sc["id"]
        st = sc["start"]
        en = sc["end"]
        fs = sc["frameSec"]

        if sid == "s01" or (en - st) < MIN_KF_SEP_SEC:
            clamped_all[sid] = {"start": round(st, 2), "end": round(en, 2), "frameSec": round(fs, 2)}
            continue

        kfs = [fs]
        while True:
            best_t = None
            best_m = 0.0
            t = st + 0.4
            while t <= en - 0.4:
                if min(abs(t - kf) for kf in kfs) >= MIN_KF_SEP_SEC:
                    nearest = min(kfs, key=lambda kf: abs(t - kf))
                    m = mad(frame_at(t), frame_at(nearest))
                    if m > best_m:
                        best_m = m
                        best_t = round(t, 2)
                t += 0.5
            if best_t is not None and best_m >= MAD_THRESHOLD:
                kfs.append(best_t)
            else:
                break

        kfs.sort()
        if len(kfs) == 1:
            clamped_all[sid] = {"start": round(st, 2), "end": round(en, 2), "frameSec": round(fs, 2)}
            continue

        # Find optimal 0.5s split points between consecutive keyframes minimizing MAD error
        splits = [round(st, 2)]
        for i in range(len(kfs) - 1):
            a_kf = kfs[i]
            b_kf = kfs[i + 1]
            a_img = frame_at(a_kf)
            b_img = frame_at(b_kf)
            lo = a_kf + 0.25
            hi = b_kf - 0.25
            sample_ts = []
            ts_cur = lo
            while ts_cur <= hi + 1e-6:
                sample_ts.append(round(ts_cur, 2))
                ts_cur += 0.25
            if not sample_ts:
                splits.append(round((a_kf + b_kf) / 2.0, 2))
                continue
            best_split = round((a_kf + b_kf) / 2.0, 2)
            best_cost = float("inf")
            cand_ts = []
            c_cur = lo
            while c_cur <= hi + 1e-6:
                cand_ts.append(round(c_cur, 2))
                c_cur += 0.5
            for s_cand in cand_ts:
                cost = 0.0
                for u in sample_ts:
                    ref_img = a_img if u < s_cand else b_img
                    cost += mad(frame_at(u), ref_img)
                if cost < best_cost:
                    best_cost = cost
                    best_split = s_cand
            splits.append(best_split)
        splits.append(round(en, 2))

        for i, kf in enumerate(kfs):
            sub_st = splits[i]
            sub_en = splits[i + 1]
            sub_fs = round(min(max(kf, sub_st + 0.05), sub_en - 0.05), 2)
            if abs(kf - fs) < 1e-3:
                clamped_all[sid] = {"start": sub_st, "end": sub_en, "frameSec": sub_fs}
            else:
                p_counter += 1
                pid = f"p{p_counter:03d}"
                pose_shots.append({
                    "id": pid,
                    "index": p_counter,
                    "parentSceneId": sid,
                    "act": act_for_sec(sub_fs),
                    "start": sub_st,
                    "end": sub_en,
                    "frameSec": sub_fs,
                })

    # Verify contiguity of all segments
    all_segs = [{"id": sid, **meta} for sid, meta in clamped_all.items()] + pose_shots
    all_segs.sort(key=lambda s: s["start"])
    assert len(clamped_all) == 150
    assert all_segs[0]["start"] == 0.0
    assert all_segs[-1]["end"] == STORY_END_SEC
    for i, seg in enumerate(all_segs):
        assert seg["start"] <= seg["frameSec"] <= seg["end"], f"Bad frameSec {seg}"
        if i > 0:
            assert abs(seg["start"] - all_segs[i - 1]["end"]) < 0.05, f"Gap at {seg}"

    # Partition pose_shots into 6 balanced batches
    n_batches = 6
    q, r = divmod(len(pose_shots), n_batches)
    batches: list[list[dict]] = []
    cur = 0
    for b in range(n_batches):
        size = q + (1 if b < r else 0)
        batches.append(pose_shots[cur : cur + size])
        cur += size

    batch_sheets = extract_and_pack(pose_shots, batches)
    plan = {
        "baseScenes": 150,
        "poseCount": len(pose_shots),
        "totalScenes": 150 + len(pose_shots),
        "clampedAll": clamped_all,
        "poseShots": pose_shots,
        "batches": {
            f"pb{idx + 1}": {
                "shotIds": [s["id"] for s in b_shots],
                "sheets": batch_sheets[f"pb{idx + 1}"],
            }
            for idx, b_shots in enumerate(batches)
        },
    }
    OUT_PLAN_PATH.write_text(json.dumps(plan, indent=2), encoding="utf-8")
    print(
        f"Synced 150 base scenes + {len(pose_shots)} pose keyframes = {plan['totalScenes']} contiguous scenes -> {OUT_PLAN_PATH.relative_to(ROOT.parent)}"
    )
    for b_key, info in plan["batches"].items():
        print(f"  Batch {b_key}: {len(info['shotIds'])} shots ({info['shotIds'][0]}..{info['shotIds'][-1]}), sheets: {info['sheets']}")
    s41_group = [s for s in all_segs if s["start"] >= 290.0 and s["end"] <= 301.0]
    print("s41 sub-scenes:", [(s["id"], s["start"], s["frameSec"], s["end"]) for s in s41_group])
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
