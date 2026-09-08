#!/usr/bin/env python3
"""Generate the fixed, browser-independent IELTS Listening PDF print pack."""

from __future__ import annotations

import copy
import html
import json
import math
import subprocess
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.pdfgen.canvas import Canvas
from reportlab.platypus import Frame, Image, Paragraph, Spacer
from pypdf import PdfReader


ROOT = Path(__file__).resolve().parents[1]
APP_JS = ROOT / "app.js"
OUT = ROOT / "assets" / "worksheets"
WIDTH, HEIGHT = A4
TEAL = colors.HexColor("#006D77")
INK = colors.HexColor("#18201F")
MUTED = colors.HexColor("#596360")
PALE = colors.HexColor("#E8F3F2")
LINE = colors.HexColor("#BFC8C6")


def clean(value: object) -> str:
    text = str(value)
    return (
        text.replace("\u2013", "-")
        .replace("\u2014", "-")
        .replace("\u2212", "-")
        .replace("\u2018", "'")
        .replace("\u2019", "'")
        .replace("\u201c", '"')
        .replace("\u201d", '"')
        .replace("\u2026", "...")
    )


def para_text(value: object) -> str:
    return html.escape(clean(value), quote=False)


def extract_data() -> tuple[dict, dict]:
    marker = "  $$('.exercise-slot[data-exercise]')"
    code = f"""
const fs=require('fs'), vm=require('vm');
let s=fs.readFileSync({json.dumps(str(APP_JS))},'utf8');
s=s.split({json.dumps(marker)})[0]+`console.log(JSON.stringify({{SETS,MOCKS}}));}})();`;
vm.runInNewContext(s,{{console,localStorage:{{getItem(){{return null}},setItem(){{}}}}}});
"""
    payload = subprocess.check_output(["node", "-e", code], text=True, cwd=ROOT)
    data = json.loads(payload)
    return data["SETS"], data["MOCKS"]


def answer_numbers(set_data: dict) -> list[str]:
    numbers: list[str] = []
    for group in set_data["groups"]:
        for question in group["questions"]:
            points = int(question.get("points", 1))
            if points > 1:
                start = int(str(question["n"]).split("-")[0].split("–")[0])
                numbers.extend(str(start + offset) for offset in range(points))
            else:
                numbers.append(clean(question["n"]))
    return numbers


def styles(compact: bool) -> dict[str, ParagraphStyle]:
    q_size = 6.4 if compact else 8.3
    option_size = 5.9 if compact else 7.7
    return {
        "group": ParagraphStyle(
            "group", fontName="Helvetica-Bold", fontSize=6.2 if compact else 7.6,
            leading=7.0 if compact else 9.0, textColor=TEAL,
            spaceBefore=2.0 if compact else 4.0, spaceAfter=1.5,
            uppercase=True,
        ),
        "question": ParagraphStyle(
            "question", fontName="Helvetica", fontSize=q_size,
            leading=q_size * 1.22, textColor=INK, alignment=TA_LEFT,
            spaceAfter=1.2 if compact else 2.2,
        ),
        "options": ParagraphStyle(
            "options", fontName="Helvetica", fontSize=option_size,
            leading=option_size * 1.2, textColor=MUTED,
            leftIndent=3 * mm, spaceAfter=1.5 if compact else 2.5,
        ),
    }


def scaled_image(path: Path, max_width: float, max_height: float) -> Image:
    image = Image(str(path))
    scale = min(max_width / image.imageWidth, max_height / image.imageHeight)
    image.drawWidth = image.imageWidth * scale
    image.drawHeight = image.imageHeight * scale
    image.hAlign = "CENTER"
    return image


def question_flows(set_data: dict, compact: bool, column_width: float) -> list:
    st = styles(compact)
    flows: list = []
    image_limit = 26 * mm if compact else 63 * mm
    for group in set_data["groups"]:
        flows.append(Paragraph(para_text(group["title"]).upper(), st["group"]))
        visual = group.get("visual")
        if visual:
            flows.append(scaled_image(ROOT / visual, column_width - 2 * mm, image_limit))
            flows.append(Spacer(1, 1.5 * mm))
        for question in group["questions"]:
            number = para_text(question["n"])
            prompt = para_text(question["prompt"])
            q_line = Paragraph(f"<b>{number}</b> &nbsp;{prompt}", st["question"])
            if question["type"] == "gap":
                line = Paragraph("____________________________", st["options"])
                flows.extend((q_line, line))
            else:
                options = "<br/>".join("[ ] " + para_text(option) for option in question["options"])
                flows.extend((q_line, Paragraph(options, st["options"])))
    return flows


def draw_brand(canvas: Canvas, left: float, top: float, width: float, title: str, detail: str) -> None:
    canvas.setFillColor(INK)
    canvas.rect(left, top - 5.5 * mm, width, 5.5 * mm, stroke=0, fill=1)
    canvas.setFillColor(colors.white)
    canvas.setFont("Helvetica-Bold", 9.2)
    canvas.drawString(left + 2 * mm, top - 3.7 * mm, clean(title))
    canvas.setFont("Helvetica-Bold", 5.8)
    detail_width = stringWidth(clean(detail), "Helvetica-Bold", 5.8)
    canvas.drawString(left + width - 2 * mm - detail_width, top - 3.6 * mm, clean(detail))


def draw_identity(canvas: Canvas, left: float, y: float, width: float) -> None:
    canvas.setFillColor(INK)
    canvas.setFont("Helvetica", 6.2)
    canvas.drawString(left, y, "Name __________________________________")
    right = "Date ______________"
    canvas.drawString(left + width - stringWidth(right, "Helvetica", 6.2), y, right)


def draw_instruction(canvas: Canvas, left: float, top: float, width: float, title: str, instruction: str, compact: bool) -> float:
    style = ParagraphStyle(
        "instruction", fontName="Helvetica", fontSize=6.2 if compact else 8.0,
        leading=7.1 if compact else 9.3, textColor=INK,
    )
    paragraph = Paragraph(f"<b>{para_text(title)}</b> - {para_text(instruction)}", style)
    _, height = paragraph.wrap(width, 15 * mm)
    paragraph.drawOn(canvas, left, top - height)
    return height


def draw_answer_grid(canvas: Canvas, left: float, bottom: float, width: float, numbers: list[str], compact: bool) -> float:
    columns = 5 if compact else 10
    rows = math.ceil(len(numbers) / columns)
    cell_h = 5.2 * mm if compact else 7 * mm
    cell_w = width / columns
    for index, number in enumerate(numbers):
        row = rows - 1 - index // columns
        col = index % columns
        x, y = left + col * cell_w, bottom + row * cell_h
        canvas.setStrokeColor(INK)
        canvas.rect(x, y, cell_w, cell_h, stroke=1, fill=0)
        canvas.setFillColor(INK)
        canvas.rect(x, y, 4.5 * mm, cell_h, stroke=0, fill=1)
        canvas.setFillColor(colors.white)
        canvas.setFont("Helvetica-Bold", 5.8 if compact else 7.2)
        canvas.drawCentredString(x + 2.25 * mm, y + cell_h / 2 - 1.8, clean(number))
    return rows * cell_h


def draw_flow_in_columns(canvas: Canvas, flows: list, frames: list[Frame], label: str) -> None:
    remaining = copy.deepcopy(flows)
    for frame in frames:
        frame.addFromList(remaining, canvas)
    if remaining:
        raise RuntimeError(f"Worksheet content overflowed its frames: {label} ({len(remaining)} flowables left)")


def build_two_up(set_data: dict, output: Path) -> None:
    canvas = Canvas(str(output), pagesize=A4, pageCompression=1)
    canvas.setTitle(clean(f"IELTS Listening Focus - {set_data['title']} - two-up worksheet"))
    margin = 9 * mm
    gap = 5 * mm
    half = (HEIGHT - 2 * margin - gap) / 2
    page_width = WIDTH - 2 * margin
    column_gap = 4 * mm
    column_width = (page_width - column_gap) / 2
    for copy_index, base in enumerate((margin + half + gap, margin)):
        top = base + half
        draw_brand(canvas, margin, top, page_width, f"IELTS Listening Focus - Part {set_data['part']}", "Dialogue Language Center")
        draw_identity(canvas, margin, top - 8 * mm, page_width)
        instruction_h = draw_instruction(canvas, margin, top - 11 * mm, page_width, set_data["title"], set_data["instruction"], True)
        grid_h = draw_answer_grid(canvas, margin, base + 4 * mm, page_width, answer_numbers(set_data), True)
        content_bottom = base + 5.5 * mm + grid_h
        content_top = top - 12 * mm - instruction_h - 1.5 * mm
        frames = [
            Frame(margin, content_bottom, column_width, content_top - content_bottom, leftPadding=0, rightPadding=1.5 * mm, topPadding=0, bottomPadding=0, showBoundary=0),
            Frame(margin + column_width + column_gap, content_bottom, column_width, content_top - content_bottom, leftPadding=1.5 * mm, rightPadding=0, topPadding=0, bottomPadding=0, showBoundary=0),
        ]
        draw_flow_in_columns(canvas, question_flows(set_data, True, column_width), frames, set_data["id"])
        canvas.setFillColor(MUTED)
        canvas.setFont("Helvetica", 5.0)
        footer = "Classroom practice - recording supplied separately - not an official IELTS paper"
        canvas.drawRightString(margin + page_width, base + 1.5 * mm, footer)
        if copy_index == 0:
            canvas.saveState()
            canvas.setStrokeColor(colors.HexColor("#777777"))
            canvas.setDash(3, 2)
            canvas.line(margin, base - gap / 2, margin + page_width, base - gap / 2)
            canvas.setDash()
            canvas.setFillColor(MUTED)
            canvas.setFont("Helvetica", 7)
            canvas.drawString(margin, base - gap / 2 + 1.2 * mm, "CUT")
            canvas.restoreState()
    canvas.showPage()
    canvas.save()


def build_method(output: Path) -> None:
    moves = [
        ("1. Preview", "Read the heading, instruction, and question block before the recording begins."),
        ("2. Predict", "Name, number, place, plural noun, adjective? Predict the answer type."),
        ("3. Mark the anchor", "Underline stable content words around each gap so you know when to listen closely."),
        ("4. Follow the question", "Answers normally come in order. Keep your eyes on the current and next item."),
        ("5. Wait through the turn", "The speaker may correct or replace the first possible answer. Wait for the completed idea."),
        ("6. Write, check, move", "Use exact spelling, obey the word limit, check singular or plural, then move on."),
    ]
    canvas = Canvas(str(output), pagesize=A4, pageCompression=1)
    canvas.setTitle("IELTS Listening Focus - six-move method - two-up card")
    margin, gap = 9 * mm, 5 * mm
    half = (HEIGHT - 2 * margin - gap) / 2
    page_width = WIDTH - 2 * margin
    for copy_index, base in enumerate((margin + half + gap, margin)):
        top = base + half
        draw_brand(canvas, margin, top, page_width, "Listening Focus - six-move method", "Dialogue IELTS")
        draw_identity(canvas, margin, top - 8 * mm, page_width)
        cols, rows = 3, 2
        card_gap = 3 * mm
        card_w = (page_width - (cols - 1) * card_gap) / cols
        card_h = 42 * mm
        start_y = top - 17 * mm
        for index, (title, body) in enumerate(moves):
            col, row = index % cols, index // cols
            x = margin + col * (card_w + card_gap)
            y = start_y - (row + 1) * card_h - row * card_gap
            canvas.setFillColor(PALE)
            canvas.setStrokeColor(LINE)
            canvas.roundRect(x, y, card_w, card_h, 2 * mm, stroke=1, fill=1)
            title_p = Paragraph(f"<b>{para_text(title)}</b>", ParagraphStyle("mt", fontName="Helvetica-Bold", fontSize=8, leading=9.5, textColor=TEAL))
            body_p = Paragraph(para_text(body), ParagraphStyle("mb", fontName="Helvetica", fontSize=6.6, leading=8.1, textColor=INK))
            title_p.wrapOn(canvas, card_w - 4 * mm, 10 * mm)
            title_p.drawOn(canvas, x + 2 * mm, y + card_h - 7 * mm)
            _, bh = body_p.wrap(card_w - 4 * mm, 27 * mm)
            body_p.drawOn(canvas, x + 2 * mm, y + card_h - 11 * mm - bh)
        canvas.setFillColor(INK)
        canvas.setFont("Helvetica-Bold", 6.5)
        canvas.drawString(margin, base + 5 * mm, "ONE-PLAY RULE: preview - predict - anchor - follow - wait - write, check, move.")
        if copy_index == 0:
            canvas.saveState(); canvas.setStrokeColor(colors.HexColor("#777777")); canvas.setDash(3, 2)
            canvas.line(margin, base - gap / 2, margin + page_width, base - gap / 2)
            canvas.setDash(); canvas.setFillColor(MUTED); canvas.setFont("Helvetica", 7)
            canvas.drawString(margin, base - gap / 2 + 1.2 * mm, "CUT"); canvas.restoreState()
    canvas.showPage(); canvas.save()


def build_mock(letter: str, set_ids: list[str], sets: dict, output: Path) -> None:
    canvas = Canvas(str(output), pagesize=A4, pageCompression=1)
    canvas.setTitle(f"IELTS Listening Focus - Test {letter} - 40 questions")
    margin = 10 * mm
    page_width = WIDTH - 2 * margin
    column_gap = 7 * mm
    column_width = (page_width - column_gap) / 2
    for part_index, set_id in enumerate(set_ids, 1):
        set_data = sets[set_id]
        top = HEIGHT - margin
        draw_brand(canvas, margin, top, page_width, f"Listening Test {letter} - Part {part_index}", f"Questions {(part_index-1)*10+1}-{part_index*10}")
        draw_identity(canvas, margin, top - 9 * mm, page_width)
        instruction_h = draw_instruction(canvas, margin, top - 14 * mm, page_width, set_data["title"], set_data["instruction"], False)
        grid_h = draw_answer_grid(canvas, margin, margin + 5 * mm, page_width, answer_numbers(set_data), False)
        content_bottom = margin + 8 * mm + grid_h
        content_top = top - 15 * mm - instruction_h - 3 * mm
        frames = [
            Frame(margin, content_bottom, column_width, content_top - content_bottom, leftPadding=0, rightPadding=2.5 * mm, topPadding=0, bottomPadding=0, showBoundary=0),
            Frame(margin + column_width + column_gap, content_bottom, column_width, content_top - content_bottom, leftPadding=2.5 * mm, rightPadding=0, topPadding=0, bottomPadding=0, showBoundary=0),
        ]
        draw_flow_in_columns(canvas, question_flows(set_data, False, column_width), frames, f"Test {letter} Part {part_index}")
        canvas.setFillColor(MUTED); canvas.setFont("Helvetica", 6)
        canvas.drawRightString(margin + page_width, margin + 1.5 * mm, "Dialogue classroom mock - not an official IELTS paper")
        canvas.showPage()
    canvas.save()


def main() -> None:
    sets, mocks = extract_data()
    OUT.mkdir(parents=True, exist_ok=True)
    filenames = {
        "harper": "part1-harper-form-2up.pdf",
        "tour": "part1-london-tour-2up.pdf",
        "travel": "part1-travel-depot-2up.pdf",
        "trains": "part2-story-of-trains-2up.pdf",
        "property": "part2-property-talk-2up.pdf",
        "alice": "part3-alice-tom-2up.pdf",
        "vegetarian": "part3-vegetarian-research-2up.pdf",
        "solar": "part3-solar-presentation-2up.pdf",
        "dolphins": "part4-dolphin-lecture-2up.pdf",
        "osteopathy": "part4-osteopathy-talk-2up.pdf",
    }
    for set_id, filename in filenames.items():
        build_two_up(sets[set_id], OUT / filename)
    build_method(OUT / "listening-six-move-method-2up.pdf")
    build_mock("A", mocks["A"], sets, OUT / "listening-full-test-a.pdf")
    build_mock("B", mocks["B"], sets, OUT / "listening-full-test-b.pdf")
    outputs = sorted(OUT.glob("*.pdf"))
    if len(outputs) != 13:
        raise RuntimeError(f"Expected 13 PDFs, created {len(outputs)}")
    for path in outputs:
        reader = PdfReader(path)
        expected_pages = 4 if path.name.startswith("listening-full-test-") else 1
        if len(reader.pages) != expected_pages:
            raise RuntimeError(f"{path.name}: expected {expected_pages} pages, found {len(reader.pages)}")
        for page in reader.pages:
            box = page.mediabox
            if abs(float(box.width) - WIDTH) > 1 or abs(float(box.height) - HEIGHT) > 1:
                raise RuntimeError(f"{path.name}: page is not A4 portrait")
            if not (page.extract_text() or "").strip():
                raise RuntimeError(f"{path.name}: page has no extractable text")
        print(path.relative_to(ROOT))


if __name__ == "__main__":
    main()
