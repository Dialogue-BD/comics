#!/usr/bin/env python3
"""Join each scene's takes into one file: scene/<id>.mp3.

A scene is recorded as takes (see sceneSegments() in scenes.js): dialogue
takes, where the two characters play a whole exchange together in one
conversational-mode call, and narration takes between them. This script

  1. reads the untouched takes from scene/_dry-originals/<id>-sNN.wav
  2. trims silence off both ends (keeping 60 ms)
  3. levels every take to the same speech loudness, so the narrator and the
     characters never jump in volume against each other
  4. lays a room-tone bed under each dialogue take (SCENE_BEDS in scenes.js,
     the components of ambience/amb.py), low-passed at 3.2 kHz to keep the
     consonant band clear, seeded by scene + room so one room sounds like one
     continuous place; narration stays dry, as voice-over
  5. joins them with pauses — 0.45 s, or 0.8 s when the next take opens a new
     panel — and peak-limits the whole file to 0.97
  6. writes scene/_build/<id>.json: where each take starts in the file and how
     much was trimmed from its front. tools/align_scenes.py needs this.

The dry takes are never modified, so this can be re-run as often as needed.

Run:  python3 tools/assemble_scenes.py                 every scene whose takes are all present
      python3 tools/assemble_scenes.py <scenario-id>   just one
Needs numpy and ffmpeg.
"""

import json
import subprocess
import sys
import zlib
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "ambience"))
from amb import FS, rd, wr, bed, fftshape, speech_rms, rms  # noqa: E402

DRY = ROOT / "scene" / "_dry-originals"
OUT = ROOT / "scene"
BUILD = ROOT / "scene" / "_build"
TARGET = 10 ** (-20 / 20)          # speech RMS every take is levelled to
GAP, GAP_PANEL, HEAD, TAIL = 0.45, 0.8, 0.3, 0.6


def load_scenes():
    code = r'''
const vm=require("vm"), fs=require("fs"), c={}; vm.createContext(c);
vm.runInContext(fs.readFileSync(process.argv[1], "utf8")+
  ";this.O={S:SCENES,B:SCENE_BEDS,G:Object.keys(SCENES).map(id=>[id,sceneSegments(id)])}", c);
console.log(JSON.stringify(c.O));
'''
    done = subprocess.run(["node", "-e", code, str(ROOT / "scenes.js")],
                          capture_output=True, text=True, check=True)
    return json.loads(done.stdout)


def trim(x, floor_db=-45.0, keep=0.06):
    """Cut leading and trailing silence; return (trimmed, seconds cut from the front)."""
    w = int(FS * 0.01)
    frames = np.sqrt(np.mean(x[: len(x) // w * w].reshape(-1, w) ** 2, axis=1))
    loud = np.where(20 * np.log10(frames + 1e-12) > floor_db + 20 * np.log10(np.abs(x).max() + 1e-12))[0]
    if not len(loud):
        return x, 0.0
    a = max(0, loud[0] * w - int(FS * keep))
    b = min(len(x), (loud[-1] + 1) * w + int(FS * keep))
    return x[a:b], a / FS


def band_snr(x, b):
    def band(sig):
        spec = np.fft.rfft(sig)
        f = np.fft.rfftfreq(len(sig), 1 / FS)
        m = (f >= 2000) & (f <= 5000)
        return float(np.sqrt(np.mean(np.abs(spec[m]) ** 2)) + 1e-12)
    return 20 * np.log10(band(x) / band(b))


def assemble(sid, scene, takes, beds):
    missing = [t["key"] for t in takes if not (DRY / (t["key"] + ".wav")).is_file()]
    if missing:
        print(f"{sid}: skipped, {len(missing)} of {len(takes)} takes missing ({missing[0]} …)")
        return False
    parts, manifest, t = [np.zeros(int(FS * HEAD))], [], HEAD
    for k, take in enumerate(takes):
        x, cut = trim(rd(str(DRY / (take["key"] + ".wav"))))
        x = x * min(TARGET / speech_rms(x), 0.97 / (np.abs(x).max() + 1e-12) * 4)
        note = ""
        if take["kind"] == "dialogue" and take["room"] in beds:
            rng = np.random.default_rng(zlib.crc32(f"{sid}:{take['room']}".encode()))
            b = bed(len(x), rng, beds[take["room"]])
            b = fftshape(b, lambda f: 1 / (1 + (f / 3200) ** 4))
            b *= speech_rms(x)
            f = min(int(FS * 0.3), len(x) // 4)
            ramp = np.ones(len(x))
            ramp[:f] = np.linspace(0, 1, f)
            ramp[-f:] = np.linspace(1, 0, f)
            b *= ramp
            snr = band_snr(x, b)
            note = f"bed {take['room']}, 2-5 kHz SNR {snr:.1f} dB" + ("  << below 20 dB" if snr < 20 else "")
            x = x + b
        manifest.append({"key": take["key"], "kind": take["kind"], "room": take["room"],
                         "lines": take["lines"], "start": round(t, 3), "trim": round(cut, 3),
                         "len": round(len(x) / FS, 3)})
        print(f"  {take['key']:32} {take['kind']:9} {len(x) / FS:5.1f}s  {note}")
        parts.append(x)
        t += len(x) / FS
        if k + 1 < len(takes):
            nxt = takes[k + 1]["lines"][0]
            last = take["lines"][-1]
            pause = GAP_PANEL if scene["lines"][nxt]["p"] != scene["lines"][last]["p"] else GAP
            parts.append(np.zeros(int(FS * pause)))
            t += pause
    parts.append(np.zeros(int(FS * TAIL)))
    y = np.concatenate(parts)
    pk = np.abs(y).max()
    if pk > 0.97:
        y *= 0.97 / pk
    wr(str(OUT / (sid + ".mp3")), y)
    BUILD.mkdir(parents=True, exist_ok=True)
    (BUILD / (sid + ".json")).write_text(json.dumps(
        {"id": sid, "dur": round(len(y) / FS, 3), "takes": manifest}, indent=1))
    print(f"{sid}: wrote scene/{sid}.mp3, {len(y) / FS:.1f}s, {len(takes)} takes")
    return True


def main():
    data = load_scenes()
    want = set(sys.argv[1:])
    done = 0
    for sid, takes in data["G"]:
        if want and sid not in want:
            continue
        done += assemble(sid, data["S"][sid], takes, data["B"])
    print(f"\n{done} scene file(s) written. Now run: python3 tools/align_scenes.py")


if __name__ == "__main__":
    main()
