"""Build the Forevergreen storyboard stills and printable worksheet."""

import json
import subprocess
from pathlib import Path

from reportlab import rl_config
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
STORYBOARD = ROOT / "storyboard"
INK = HexColor("#18382f")
MUTED = HexColor("#495650")
RULE = HexColor("#a2aaa6")


def build_stills(scenes):
    for number, scene in enumerate(scenes, start=1):
        frame = STORYBOARD / f"scene-{number:02}.jpg"
        subprocess.run(
            [
                "ffmpeg", "-v", "error", "-y", "-ss", str(scene["time"]),
                "-i", str(ROOT / "video" / "forevergreen.mp4"),
                "-frames:v", "1", "-vf", "crop=1280:536:0:92,scale=960:402",
                "-q:v", "3", "-update", "1", str(frame),
            ],
            check=True,
        )


def build_worksheet(scenes):
    page_width, page_height = A4
    left, right = 37, page_width - 37
    pdf = canvas.Canvas(str(STORYBOARD / "forevergreen-storyboard.pdf"), pagesize=A4)
    pdf.setTitle("Forevergreen | Retell the story")
    pdf.setAuthor("Dialogue")
    pdf.setCreator("Dialogue")

    rows_per_page = 5
    for start in range(0, len(scenes), rows_per_page):
        page_scenes = scenes[start : start + rows_per_page]
        pdf.setFillColor(INK)
        pdf.setFont("Times-Bold", 27)
        pdf.drawString(left, page_height - 51, "Forevergreen")
        pdf.setFont("Helvetica-Bold", 12)
        pdf.drawRightString(right, page_height - 50, "Retell the story")

        pdf.setFillColor(MUTED)
        pdf.setFont("Helvetica", 10.5)
        pdf.drawString(left, page_height - 76, "Use the pictures to tell the story in your own words.")
        pdf.drawString(left, page_height - 91, "Write two or three sentences for each scene. Say what happened and why.")
        pdf.drawString(left, page_height - 117, "Name")
        pdf.drawString(right - 128, page_height - 117, "Date")
        pdf.setStrokeColor(RULE)
        pdf.setLineWidth(0.55)
        pdf.line(left + 32, page_height - 118, left + 251, page_height - 118)
        pdf.line(right - 102, page_height - 118, right, page_height - 118)

        for row, scene in enumerate(page_scenes):
            number = start + row + 1
            top = page_height - 139 - row * 128
            pdf.setStrokeColor(RULE)
            pdf.line(left, top, right, top)
            pdf.setFont("Helvetica-Bold", 11)
            pdf.setFillColor(INK)
            pdf.drawString(left, top - 16, f"{number}. {scene['title']}")
            pdf.drawImage(
                str(STORYBOARD / f"scene-{number:02}.jpg"), left, top - 108,
                width=202, height=202 * 402 / 960,
            )
            for line in range(5):
                y = top - 21 - line * 21
                pdf.line(left + 222, y, right, y)

        pdf.setFillColor(MUTED)
        pdf.setFont("Helvetica", 8)
        pdf.drawString(left, 32, "Film stills from Forevergreen by Nathan Engelhardt and Jeremy Spears")
        pdf.drawRightString(right, 32, f"Scenes {start + 1}-{start + len(page_scenes)} of {len(scenes)}")
        pdf.showPage()
    pdf.save()


if __name__ == "__main__":
    rl_config.useA85 = False
    scenes = json.loads((STORYBOARD / "scenes.json").read_text())
    build_stills(scenes)
    build_worksheet(scenes)
