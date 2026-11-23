"""Extract the short film and soundtrack excerpts used in Critical thinking."""

import json
import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
LESSON = ROOT / "critical-thinking"
VIDEO = ROOT / "video" / "forevergreen.mp4"
CROP = "crop=1280:536:0:92"


def extract(start, output, *args):
    subprocess.run(
        ["ffmpeg", "-v", "error", "-y", "-ss", str(start), "-i", str(VIDEO), *args, str(output)],
        check=True,
    )


def build(topic):
    for frame in topic["frames"]:
        if "file" in frame:
            continue
        time = frame["time"]
        extract(
            time, LESSON / f"frame-{time}.jpg",
            "-frames:v", "1", "-vf", f"{CROP},scale=864:362", "-q:v", "3", "-update", "1",
        )

    for media in topic.get("media", []):
        start = media["start"]
        duration = str(media["end"] - start)
        if media["kind"] == "audio":
            extract(
                start, LESSON / f"clip-{start}.mp3", "-t", duration,
                "-vn", "-c:a", "libmp3lame", "-b:a", "80k",
            )
        else:
            extract(
                start, LESSON / f"clip-{start}.mp4", "-t", duration,
                "-vf", f"{CROP},scale=640:268", "-c:v", "libx264", "-crf", "24",
                "-c:a", "aac", "-b:a", "80k", "-movflags", "+faststart",
            )


if __name__ == "__main__":
    for topic in json.loads((LESSON / "topics.json").read_text()):
        build(topic)
