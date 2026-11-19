#!/usr/bin/env python3
"""Generate cached MP3 speech clips for GitHub for Vibecoders.

Supports local neural Phonon (`gradium/phonon-31m-en` via `ptts`) by default,
or ElevenLabs API when invoked with `--provider elevenlabs`.
"""

from __future__ import annotations

import argparse
import json
import os
import shutil
import subprocess
import sys
import tempfile
import urllib.error
import urllib.request
from pathlib import Path

ACTIVITY_DIR = Path(__file__).resolve().parent.parent
AUDIO_DIR = ACTIVITY_DIR / "audio"
MANIFEST_PATH = AUDIO_DIR / "manifest.json"
DEFAULT_PHONON_MODEL = "hf://gradium/phonon-31m-en"
DEFAULT_ELEVEN_MODEL = "eleven_multilingual_v2"
DEFAULT_ELEVEN_VOICE = "onwK4e9ZLuTAKqWW03F9"  # Daniel

CLIPS: dict[str, str] = {
    # Module 1 Vocab (3)
    "vocab-vibecoding": "Vibe coding: Building software by describing what you want to AI in plain language instead of typing code by hand.",
    "vocab-git": "Git: The local time machine to record every working snapshot of your project.",
    "vocab-github": "GitHub: The online cloud vault where your Git history lives safely and can be shared or published.",
    # Module 2 GPA Wordless Lab — Single Words (16)
    "gpa-word-vibecoding": "Vibe coding.",
    "gpa-word-apikey": "API key.",
    "gpa-word-repo": "Repository, or repo.",
    "gpa-word-commit": "Commit.",
    "gpa-word-push": "Push.",
    "gpa-word-pull": "Pull.",
    "gpa-word-main": "Main.",
    "gpa-word-head": "Head.",
    "gpa-word-branch": "Branch.",
    "gpa-word-merge": "Merge.",
    "gpa-word-revert": "Revert.",
    "gpa-word-conflict": "Conflict.",
    "gpa-word-clone": "Clone.",
    "gpa-word-fork": "Fork.",
    "gpa-word-diff": "Diff.",
    "gpa-word-pr": "Pull Request, or P R.",
    # Module 2 GPA Wordless Lab — Word + Meaning (16)
    "gpa-say-vibecoding": "Vibe coding. Building an app by telling AI what you want in plain language.",
    "gpa-say-apikey": "API key. Your secret digital password that lets your app talk to AI. Keep it private like a PIN.",
    "gpa-say-repo": "Repository, also called a repo. The master vault folder on GitHub.",
    "gpa-say-commit": "Commit. Save a named checkpoint.",
    "gpa-say-push": "Push. Upload commits up to the cloud.",
    "gpa-say-pull": "Pull. Download updates down to your laptop.",
    "gpa-say-main": "Main. Your official live track that always stays working.",
    "gpa-say-head": "Head. The marker showing which save point you are standing on right now.",
    "gpa-say-branch": "Branch. Open a parallel safe track.",
    "gpa-say-merge": "Merge. Join the tested branch back into main.",
    "gpa-say-revert": "Revert. Rewind safely to a working save point.",
    "gpa-say-conflict": "Conflict. Two edits clash on the same line.",
    "gpa-say-clone": "Clone: copy a full GitHub repo onto your laptop.",
    "gpa-say-fork": "Fork. Make your own copy of a Repository on GitHub.",
    "gpa-say-diff": "Diff. Compare red removed lines and green added lines.",
    "gpa-say-pr": "Pull Request, often called a P R. Ask to review and merge your branch into main.",
    # Module 2 GPA Wordless Lab — Hear & Point Prompts (23)
    "gpa-pt-vibecoding": "Point to: Vibe coding.",
    "gpa-pt-apikey": "Point to: API key.",
    "gpa-pt-repo": "Point to: Repository, or repo.",
    "gpa-pt-commit": "Point to: Commit.",
    "gpa-pt-push": "Point to: Push.",
    "gpa-pt-pull": "Point to: Pull.",
    "gpa-pt-main": "Point to: Main.",
    "gpa-pt-head": "Point to: Head.",
    "gpa-pt-branch": "Point to: Branch.",
    "gpa-pt-merge": "Point to: Merge.",
    "gpa-pt-revert": "Point to: Revert.",
    "gpa-pt-conflict": "Point to: Conflict.",
    "gpa-pt-clone": "Point to: Clone.",
    "gpa-pt-fork": "Point to: Fork.",
    "gpa-pt-diff": "Point to: Diff.",
    "gpa-pt-pr": "Point to: Pull Request, or P R.",
    "gpa-seq-vibecoding-commit": "Two steps in order: first Vibe coding, then Commit.",
    "gpa-seq-commit-push": "Two steps in order: first Commit, then Push.",
    "gpa-seq-pull-commit": "Two steps in order: first Pull, then Commit.",
    "gpa-seq-branch-merge": "Two steps in order: first Branch, then Merge.",
    "gpa-seq-conflict-revert": "Two steps in order: first Conflict, then Revert.",
    "gpa-seq-fork-clone": "Two steps in order: first Fork, then Clone.",
    "gpa-seq-diff-pr": "Two steps in order: first Diff, then Pull Request.",
    # Module 2 GPA Wordless Lab — Set Recaps (4)
    "gpa-set-a": "Vibe coding, API key, Repository, Commit, Push, Pull.",
    "gpa-set-b": "Main, Head, Branch, Merge, Revert.",
    "gpa-set-c": "Conflict, Clone, Fork, Diff, Pull Request.",
    "gpa-set-all": "Vibe coding, API key, Repository, Commit, Push, Pull, Main, Head, Branch, Merge, Revert, Conflict, Clone, Fork, Diff, Pull Request.",
    # Module 5 — 5 Golden Habits (5)
    "habit-1": "1. Test first, commit second. Never save broken code as your main checkpoint.",
    "habit-2": "2. Commit small, commit often. One working feature equals one commit.",
    "habit-3": "3. Write plain-English commit messages so Future You knows what worked.",
    "habit-4": "4. Branch before big risks. Start a branch before asking AI to redesign everything.",
    "habit-5": "5. Never push secret API keys. Keep keys in dot-env and list dot-env inside dot-gitignore.",
    # Toolkit Dialog — 17-Word Glossary (17)
    "gloss-vibecoding": "Vibe coding. Building apps by describing what you want to AI in plain language instead of coding by hand.",
    "gloss-apikey": "API key. Your secret digital password letting an app connect to AI. Never push it to public GitHub.",
    "gloss-repo": "Repository, also called a repo. Master vault folder holding project files and history.",
    "gloss-commit": "Commit. Numbered working save point stored on your device.",
    "gloss-push": "Push. Upload local commits up to GitHub dot com cloud.",
    "gloss-pull": "Pull. Download newer commits from GitHub down to your laptop.",
    "gloss-main": "Main. The primary working track of your project on GitHub.",
    "gloss-head": "Head. The pointer showing your current save point or active branch.",
    "gloss-clone": "Clone: copy a full GitHub repo onto your computer for editing in an IDE.",
    "gloss-branch": "Branch. Safe parallel sandbox track so main stays unbroken.",
    "gloss-merge": "Merge. Combine tested branch changes back into main.",
    "gloss-conflict": "Conflict. Clash when two edits change the exact same line differently.",
    "gloss-revert": "Revert. Rewind safely from a broken change back to a working green commit.",
    "gloss-fork": "Fork. Create your own independent copy of someone else's repo on GitHub.",
    "gloss-diff": "Diff. Red and green line comparison showing exactly what AI altered.",
    "gloss-pr": "Pull Request, often called a P R. A review proposal asking to merge your branch safely into main.",
    # Toolkit Dialog — 19-Word Glossary (19)
    "gloss-ide": "I D E, or Visual Code Editor. A workspace with buttons, file panels, and previews like Antigravity, Cursor, or V S Code.",
    "gloss-cli": "C L I, or Command Line Interface. A text terminal where you or AI agents like Claude and Codex run Git commands directly.",
    "gloss-gitignore": "Dot-gitignore and dot-env. Secret locker and gatekeeper blocking API keys from upload.",
    # Toolkit Dialog — 6 Client English Phrases (6)
    "client-1": "Hi! Here is the live GitHub Pages preview link for today's version. Please test the button and share your feedback.",
    "client-2": "I have pushed a clean working commit to main on GitHub before starting the homepage redesign on a separate branch.",
    "client-3": "The experimental layout caused a display issue on mobile, so I reverted cleanly to our previous working commit with zero downtime.",
    "client-4": "I just pushed the updated checkout calculator to main. Please pull the latest commit before editing the CSS file.",
    "client-5": "I created a Private GitHub Repository first while we build, and we can publish the static preview when ready.",
    "client-6": "All API credentials are stored locally in environment variables and excluded via dot-gitignore so no keys are ever exposed.",
    # Guided Step Coach Cues (17) + Voice Lab Mini (5)
    "step-0": "Welcome to GitHub for Vibe coding. Learn how to keep your AI projects safe without writing code.",
    "step-1": "Watch what happens at Prompt 15. One small change breaks the app! Compare ZIP folders with GitHub.",
    "step-2": "Now open the Diff X-Ray. Tap the red line and green line to see what AI changed.",
    "step-vl": "Say short Git, not long geat. Relax your cheeks like Tim, not team.",
    "vl-geet": "Geat.",
    "vl-git": "Git.",
    "vl-team": "Team.",
    "vl-tim": "Tim.",
    "step-3": "First, just watch and hear six core words. Tap Play, or tap any animation.",
    "step-4": "Time to play! Listen to each word, and tap the matching animation.",
    "step-5": "Here are five track and rescue words: Main, Head, Branch, Merge, and Revert. Watch the motion first.",
    "step-6": "Listen carefully, and point to the matching safety animation.",
    "step-7": "Meet five team and pro GitHub words. Watch and tap each animation.",
    "step-pro-game": "Hear and Point! Listen carefully and tap the matching GitHub animation.",
    "step-8": "See how the words connect like railway tracks. Tap each station button.",
    "step-9": "Watch how your code travels between your laptop, GitHub cloud, and the live web.",
    "step-tools": "There are two ways to work with Git and code: a visual I D E with buttons like Antigravity or Cursor, or a text terminal C L I like Claude and Codex.",
    "step-where": "Where do you build? Start easily in your browser with Google AI Studio, or step up later to a laptop I D E or C L I.",
    "where-browser": "Browser mode with Google AI Studio is the easiest first step. Nothing to install, just describe your idea and save to GitHub.",
    "where-laptop": "Laptop mode with an AI I D E like Antigravity or Cursor, or a C L I like Claude and Codex, is an optional pro step when your project grows bigger.",
    "tools-ide": "Visual I D E. Click buttons, inspect files, and see live previews in tools like Antigravity, Cursor, and V S Code.",
    "tools-cli": "Terminal C L I. Type Git commands directly, or let terminal agents like Claude and Codex run commands for you.",
    "step-10": "Now watch how to save a Google AI Studio app to GitHub with zero coding.",
    "step-11": "Watch how an AI IDE saves checkpoints, compares changes, and syncs to GitHub.",
    "step-12": "Your turn! Tap the four glowing buttons inside the IDE to hear what each one does.",
    "step-13": "Keep your secret API keys safe. Test a key leak versus a safe shield, then check free Pages.",
    "step-14": "Tap a situation to get the exact English prompt for your AI, and hear how to say it to clients.",
    "step-15": "You are ready! You now know the five golden habits of safe Vibe coding with GitHub.",
    # Interactive Screen Cues (18)
    "diff-base": "Line fourteen sets the mango price: two crates times fifteen hundred equals three thousand Taka.",
    "diff-del": "Red minus means AI deleted the working fee calculation line.",
    "diff-add": "Green plus shows the broken line AI wrote by mistake, turning the total into an error.",
    "diff-btn": "Green plus here changes the order button color to gold. That part works fine.",
    "tree-repo": "Repository, also called a repo. The master garage holding your whole project and every version.",
    "tree-commit": "Commit. A green working checkpoint you can always come back to.",
    "tree-branch": "Branch. A safe side track where you can test bold new changes safely.",
    "tree-discard": "Discard. Throw away the broken branch. Your main app is still green.",
    "tree-merge": "Merge. Join your tested new feature cleanly back into main.",
    "sync-push": "Push sends your saved commits up to the GitHub cloud, and updates your live website.",
    "sync-pull": "Pull brings the newest commits from GitHub down to your laptop.",
    "sync-clone": "Clone downloads a full copy of a GitHub repo so you can edit it in an IDE.",
    "shield-leak": "Danger! An API key is like your bKash PIN. Putting it inside app dot J S posts your secret PIN onto a public campus noticeboard where bots steal it in seconds.",
    "shield-safe": "Safe! Keep your secret API key PIN inside your locked pocket, dot env, and let dot gitignore keep it off the public noticeboard.",
    "prompt-fix": "Stop. Do not rewrite everything. Revert back to our last working commit, then fix only the bKash fee calculation.",
    "prompt-branch": "I want to try a bold homepage redesign. First confirm I am on a new branch, not main, so the working app stays safe.",
    "prompt-key": "Move all API keys out of frontend files into dot env, read them securely, and make sure dot env is listed in dot gitignore.",
    "prompt-live": "Prepare this project for free static hosting on GitHub Pages with relative paths and zero secret keys.",
}

CLIP_TTS_KWARGS: dict[str, dict[str, object]] = {
    "gpa-word-repo": {"temperature": 0.45, "seed": 7},
    "gpa-say-repo": {"temperature": 0.45, "seed": 7},
    "gpa-pt-repo": {"temperature": 0.45, "seed": 7},
    "gpa-say-fork": {"temperature": 0.45, "seed": 7},
    "gpa-set-a": {"temperature": 0.45, "seed": 7},
    "gpa-set-all": {"temperature": 0.45, "seed": 7},
    "gloss-repo": {"temperature": 0.45, "seed": 7},
    "tree-repo": {"temperature": 0.45, "seed": 7},
    "client-5": {"temperature": 0.45, "seed": 7},
    "gpa-word-pr": {"temperature": 0.55, "seed": 11},
    "gpa-say-pr": {"temperature": 0.55, "seed": 11},
    "gpa-pt-pr": {"temperature": 0.55, "seed": 11},
    "gloss-pr": {"temperature": 0.55, "seed": 11},
    "tree-branch": {"temperature": 0.55, "seed": 11},
}


def find_ffmpeg() -> str:
    """Locate ffmpeg executable for MP3 transcoding and loudness normalization."""
    candidate = shutil.which("ffmpeg") or "/opt/homebrew/bin/ffmpeg"
    if not Path(candidate).exists():
        raise FileNotFoundError("ffmpeg not found on PATH or at /opt/homebrew/bin/ffmpeg")
    return candidate


def wav_to_mp3(ffmpeg_bin: str, wav_path: Path, mp3_path: Path) -> None:
    """Trim leading silence, loudness-normalize, and encode to 24 kHz mono MP3."""
    cmd = [
        ffmpeg_bin,
        "-y",
        "-i",
        str(wav_path),
        "-af",
        "silenceremove=start_periods=1:start_threshold=-45dB:detection=peak,loudnorm=I=-16:TP=-1.5:LRA=11",
        "-ac",
        "1",
        "-ar",
        "24000",
        "-b:a",
        "64k",
        str(mp3_path),
    ]
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)


class PhononSynthesizer:
    """Synthesize speech locally using Gradium Phonon via Python `ptts` or CLI."""

    def __init__(self, model: str, voice: str) -> None:
        self.model = model
        self.voice = voice
        self.engine = None
        self.cli_bin: str | None = None
        self.resolved_voice: str = voice

        try:
            import ptts  # type: ignore

            self.engine = ptts.TTS(
                model,
                lang="en",
                quant="q8",
                voice=None if voice == "default" else voice,
                voice_catalog=ptts.DEFAULT_VOICE_CATALOG,
            )
        except ImportError:
            self.cli_bin = shutil.which("ptts") or "/opt/homebrew/bin/ptts"
            if not Path(self.cli_bin).exists():
                raise RuntimeError(
                    "Neither Python module 'ptts' nor 'ptts' CLI binary is available."
                )

    def synthesize_wav(self, text: str, wav_path: Path, **tts_kwargs) -> None:
        if self.engine is not None:
            kwargs = dict(tts_kwargs)
            if self.resolved_voice and self.resolved_voice != "default":
                kwargs["voice"] = self.resolved_voice
            self.engine.save(str(wav_path), text, **kwargs)
            return

        assert self.cli_bin is not None
        cmd = [self.cli_bin, "--model", self.model, "--lang", "en", "--quant", "q8"]
        if self.resolved_voice and self.resolved_voice != "default":
            cmd.extend(["--voice", self.resolved_voice])
        cmd.extend([text, "-o", str(wav_path)])
        subprocess.run(cmd, check=True)


def synthesize_elevenlabs(text: str, mp3_path: Path, api_key: str, voice_id: str, model_id: str) -> None:
    """Synthesize direct MP3 speech via the ElevenLabs TTS REST API."""
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
    payload = json.dumps({"text": text, "model_id": model_id}).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=payload,
        method="POST",
        headers={
            "xi-api-key": api_key,
            "Content-Type": "application/json",
            "Accept": "audio/mpeg",
        },
    )
    with urllib.request.urlopen(req, timeout=60) as resp:
        mp3_path.write_bytes(resp.read())


def write_manifest(out_dir: Path, provider: str, model: str, voice: str) -> None:
    """Write audio/manifest.json for all canonical clips present on disk."""
    clips_map: dict[str, str] = {}
    for clip_id in CLIPS:
        mp3_path = out_dir / f"{clip_id}.mp3"
        if mp3_path.exists() and mp3_path.stat().st_size > 512:
            clips_map[clip_id] = f"audio/{clip_id}.mp3"
    manifest = {
        "provider": provider,
        "model": model,
        "voice": voice,
        "version": 13,
        "clips": clips_map,
    }
    (out_dir / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate TTS MP3 clips for github-vibecoding.")
    parser.add_argument("--provider", choices=("phonon", "elevenlabs"), default="phonon")
    parser.add_argument("--voice", default="Harper", help="Phonon voice name (default: Harper, en-US)")
    parser.add_argument("--voice-id", default=os.environ.get("ELEVENLABS_VOICE_ID", DEFAULT_ELEVEN_VOICE))
    parser.add_argument("--only", nargs="+", help="Generate only specific clip IDs")
    parser.add_argument("--force", action="store_true", help="Re-render existing MP3 files")
    parser.add_argument("--out-dir", type=Path, default=AUDIO_DIR)
    args = parser.parse_args()

    if args.only:
        unknown = [cid for cid in args.only if cid not in CLIPS]
        if unknown:
            print(f"Unknown clip ID(s): {', '.join(unknown)}", file=sys.stderr)
            return 2

    out_dir: Path = args.out_dir
    out_dir.mkdir(parents=True, exist_ok=True)
    target_ids = list(args.only) if args.only else list(CLIPS.keys())

    if args.provider == "phonon":
        ffmpeg_bin = find_ffmpeg()
        synth = PhononSynthesizer(DEFAULT_PHONON_MODEL, args.voice)
        model_label = DEFAULT_PHONON_MODEL
        voice_label = synth.resolved_voice
        with tempfile.TemporaryDirectory(prefix="phonon-tts-") as tmp_dir_str:
            tmp_dir = Path(tmp_dir_str)
            for idx, clip_id in enumerate(target_ids, start=1):
                mp3_path = out_dir / f"{clip_id}.mp3"
                if mp3_path.exists() and mp3_path.stat().st_size > 512 and not args.force:
                    print(f"[{idx}/{len(target_ids)}] skip {clip_id} (exists)")
                    continue
                wav_path = tmp_dir / f"{clip_id}.wav"
                print(f"[{idx}/{len(target_ids)}] synth {clip_id}...")
                synth.synthesize_wav(CLIPS[clip_id], wav_path, **CLIP_TTS_KWARGS.get(clip_id, {}))
                wav_to_mp3(ffmpeg_bin, wav_path, mp3_path)
                wav_path.unlink(missing_ok=True)
    else:
        api_key = os.environ.get("ELEVENLABS_API_KEY", "").strip()
        if not api_key:
            print("ELEVENLABS_API_KEY is not set in environment.", file=sys.stderr)
            return 2
        model_label = DEFAULT_ELEVEN_MODEL
        voice_label = args.voice_id
        for idx, clip_id in enumerate(target_ids, start=1):
            mp3_path = out_dir / f"{clip_id}.mp3"
            if mp3_path.exists() and mp3_path.stat().st_size > 512 and not args.force:
                print(f"[{idx}/{len(target_ids)}] skip {clip_id} (exists)")
                continue
            print(f"[{idx}/{len(target_ids)}] elevenlabs {clip_id}...")
            try:
                synthesize_elevenlabs(CLIPS[clip_id], mp3_path, api_key, args.voice_id, DEFAULT_ELEVEN_MODEL)
            except urllib.error.URLError as exc:
                print(f"ElevenLabs request failed for {clip_id}: {exc}", file=sys.stderr)
                return 1

    write_manifest(out_dir, args.provider, model_label, voice_label)
    print(f"Done. Wrote manifest to {out_dir / 'manifest.json'}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
