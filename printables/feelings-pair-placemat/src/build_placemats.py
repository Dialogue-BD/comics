from pathlib import Path

from PIL import Image
from reportlab.lib.colors import Color, HexColor, white
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
OUT = ROOT / "output" / "pdf"
PAGE_W, PAGE_H = landscape(A4)

FONT_DIR = Path("/Users/timothyhall/.codex/plugins/cache/claude-cowork/anthropic-skills/1.0.0/skills/canvas-design/canvas-fonts")
pdfmetrics.registerFont(TTFont("WorkSans", str(FONT_DIR / "WorkSans-Regular.ttf")))
pdfmetrics.registerFont(TTFont("WorkSansBold", str(FONT_DIR / "WorkSans-Bold.ttf")))
pdfmetrics.registerFont(TTFont("PlexSerifBold", str(FONT_DIR / "IBMPlexSerif-Bold.ttf")))
pdfmetrics.registerFont(TTFont("Instrument", str(FONT_DIR / "InstrumentSans-Regular.ttf")))

PAPER = HexColor("#F7F1E4")
CARD = HexColor("#FFFDF7")
INK = HexColor("#15271F")
MUTED = HexColor("#64736C")
LINE = HexColor("#D6D6CC")
FOREST = HexColor("#17372B")
CORAL = HexColor("#E86F57")
VIOLET = HexColor("#9270CF")
OCHRE = HexColor("#DDAF43")
SKY = HexColor("#69B5D7")
GREEN = HexColor("#62BD83")
ROSE = HexColor("#CF6878")


EMOTIONS = [
    {
        "key": "fear",
        "primary": "FEAR",
        "head": "anxious",
        "words": "worried / overwhelmed",
        "chunks": ["anxious about...", "worried that...", "overwhelmed by..."],
        "color": VIOLET,
        "source": "challenging-emotions-triptych.png",
        "panel": 0,
    },
    {
        "key": "anger",
        "primary": "ANGER",
        "head": "frustrated",
        "words": "annoyed / furious",
        "chunks": ["frustrated with...", "angry about...", "fed up with..."],
        "color": CORAL,
        "source": "challenging-emotions-triptych.png",
        "panel": 1,
    },
    {
        "key": "sad",
        "primary": "SAD",
        "head": "lonely",
        "words": "upset / disappointed",
        "chunks": ["sad about...", "disappointed with...", "feel left out"],
        "color": SKY,
        "source": "challenging-emotions-triptych.png",
        "panel": 2,
    },
    {
        "key": "happy",
        "primary": "HAPPY",
        "head": "proud",
        "words": "pleased / excited",
        "chunks": ["proud of...", "pleased with...", "excited about..."],
        "color": OCHRE,
        "source": "expansive-emotions-triptych.png",
        "panel": 0,
    },
    {
        "key": "surprise",
        "primary": "SURPRISE",
        "head": "surprised",
        "words": "amazed / confused",
        "chunks": ["surprised by...", "didn't expect...", "caught off guard"],
        "color": GREEN,
        "source": "expansive-emotions-triptych.png",
        "panel": 1,
    },
    {
        "key": "disgust",
        "primary": "DISGUST",
        "head": "uncomfortable",
        "words": "uneasy / disgusted",
        "chunks": ["uncomfortable with...", "put off by...", "disgusted by..."],
        "color": ROSE,
        "source": "expansive-emotions-triptych.png",
        "panel": 2,
    },
]


def crop_panels():
    for emotion in EMOTIONS:
        out = ASSETS / f"scene-{emotion['key']}.jpg"
        if out.exists():
            continue
        source = Image.open(ASSETS / emotion["source"]).convert("RGB")
        width, height = source.size
        segment = width / 3
        left = int(emotion["panel"] * segment + 13)
        right = int((emotion["panel"] + 1) * segment - 13)
        crop = source.crop((left, 12, right, height - 12))
        crop.save(out, quality=94, subsampling=0)


def round_rect(c, x, y, w, h, radius=12, fill=CARD, stroke=LINE, width=0.7):
    c.setFillColor(fill)
    c.setStrokeColor(stroke)
    c.setLineWidth(width)
    c.roundRect(x, y, w, h, radius, fill=1, stroke=1)


def draw_cover(c, image_path, x, y, w, h, radius=10):
    image = Image.open(image_path)
    iw, ih = image.size
    scale = max(w / iw, h / ih)
    sw, sh = iw * scale, ih * scale
    dx, dy = x + (w - sw) / 2, y + (h - sh) / 2
    c.saveState()
    path = c.beginPath()
    path.roundRect(x, y, w, h, radius)
    c.clipPath(path, stroke=0, fill=0)
    c.drawImage(ImageReader(image), dx, dy, sw, sh, mask="auto")
    c.restoreState()


def fit_size(text, font, start, max_width, minimum=5):
    size = start
    while size > minimum and pdfmetrics.stringWidth(text, font, size) > max_width:
        size -= 0.25
    return size


def draw_centered(c, text, x, y, w, font, size, color=INK):
    size = fit_size(text, font, size, w)
    c.setFont(font, size)
    c.setFillColor(color)
    c.drawCentredString(x + w / 2, y, text)


def wrapped_lines(text, font, size, max_width):
    words = text.split()
    lines = []
    current = ""
    for word in words:
        trial = f"{current} {word}".strip()
        if current and pdfmetrics.stringWidth(trial, font, size) > max_width:
            lines.append(current)
            current = word
        else:
            current = trial
    if current:
        lines.append(current)
    return lines


def draw_wrapped(c, text, x, top, max_width, font="WorkSans", size=8, color=INK, leading=None, max_lines=None):
    leading = leading or size * 1.25
    lines = wrapped_lines(text, font, size, max_width)
    if max_lines:
        lines = lines[:max_lines]
    c.setFont(font, size)
    c.setFillColor(color)
    for i, line in enumerate(lines):
        c.drawString(x, top - i * leading, line)
    return top - len(lines) * leading


def draw_header_overlay(c, concept, subtitle):
    c.setFillColor(PAPER)
    c.rect(0, PAGE_H - 69, PAGE_W, 69, fill=1, stroke=0)
    c.setFillColor(FOREST)
    c.rect(0, PAGE_H - 8, PAGE_W, 8, fill=1, stroke=0)
    c.setFont("PlexSerifBold", 25)
    c.setFillColor(INK)
    c.drawString(24, PAGE_H - 43, "FEELINGS IN MOTION")
    c.setFont("WorkSansBold", 8)
    c.setFillColor(MUTED)
    c.drawString(26, PAGE_H - 57, subtitle.upper())
    pill_w = 228
    round_rect(c, PAGE_W - pill_w - 24, PAGE_H - 56, pill_w, 28, 14, fill=FOREST, stroke=FOREST)
    draw_centered(c, "POINT  >  ASK  >  ANSWER  >  FOLLOW UP  >  SWITCH", PAGE_W - pill_w - 24, PAGE_H - 46, pill_w, "WorkSansBold", 7.6, white)
    c.setFont("WorkSans", 5.5)
    c.setFillColor(MUTED)
    c.drawRightString(PAGE_W - 25, 12, f"{concept}  |  A4 LANDSCAPE  |  NO WRITING")


def draw_header(c, concept, subtitle):
    c.setFillColor(PAPER)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    draw_header_overlay(c, concept, subtitle)


def draw_scene_card(c, emotion, x, y, w, h, compact=False):
    round_rect(c, x, y, w, h, 12, fill=CARD, stroke=emotion["color"], width=1.25)
    image_h = h * (0.51 if compact else 0.54)
    draw_cover(c, ASSETS / f"scene-{emotion['key']}.jpg", x + 4, y + h - image_h - 4, w - 8, image_h, 8)
    c.setFillColor(emotion["color"])
    c.roundRect(x + 9, y + h - image_h - 17, 43, 15, 7, fill=1, stroke=0)
    c.setFont("WorkSansBold", 6.2)
    c.setFillColor(white)
    c.drawCentredString(x + 30.5, y + h - image_h - 12, emotion["primary"])
    c.setFont("PlexSerifBold", 12 if not compact else 10.5)
    c.setFillColor(INK)
    c.drawString(x + 9, y + h - image_h - 34, emotion["head"])
    c.setFont("WorkSans", 6.2 if not compact else 5.5)
    c.setFillColor(MUTED)
    stack_words = compact or len(emotion["head"]) > 10
    if stack_words:
        c.drawString(x + 9, y + h - image_h - 45, emotion["words"])
    else:
        c.drawRightString(x + w - 8, y + h - image_h - 31.5, emotion["words"])
    chunk_size = 6.7 if not compact else 5.8
    start_y = y + h - image_h - 49
    chunk_step = 13 if stack_words else 17
    for i, chunk in enumerate(emotion["chunks"]):
        c.setFillColor(Color(emotion["color"].red, emotion["color"].green, emotion["color"].blue, alpha=0.11))
        c.roundRect(x + 8, start_y - i * chunk_step - 9, w - 16, 13, 6.5, fill=1, stroke=0)
        c.setFont("WorkSansBold" if i == 0 else "WorkSans", chunk_size)
        c.setFillColor(INK)
        c.drawString(x + 13, start_y - i * chunk_step - 5, chunk)


def numbered_stage(c, number, title, lines, x, y, w, h, color, dark=False):
    fill = FOREST if dark else CARD
    stroke = FOREST if dark else color
    round_rect(c, x, y, w, h, 13, fill=fill, stroke=stroke, width=1.05)
    c.setFillColor(color if dark else color)
    c.circle(x + 19, y + h - 20, 11, fill=1, stroke=0)
    c.setFont("WorkSansBold", 9)
    c.setFillColor(FOREST if not dark else white)
    c.drawCentredString(x + 19, y + h - 23, str(number))
    c.setFont("WorkSansBold", 9)
    c.setFillColor(white if dark else INK)
    c.drawString(x + 38, y + h - 23, title.upper())
    top = y + h - 42
    for line in lines:
        if isinstance(line, tuple):
            label, phrase = line
            c.setFont("WorkSansBold", 6.4)
            c.setFillColor(color if dark else MUTED)
            c.drawString(x + 13, top, label.upper())
            top -= 10
            top = draw_wrapped(c, phrase, x + 13, top, w - 26, "WorkSans", 7.5, white if dark else INK, 9.3) - 3
        else:
            top = draw_wrapped(c, line, x + 13, top, w - 26, "WorkSans", 7.4, white if dark else INK, 9.2) - 4


def draw_rounds_bar(c, x, y, w):
    round_rect(c, x, y, w, 44, 12, fill=FOREST, stroke=FOREST)
    labels = [
        ("ROUND 1", "Use the character"),
        ("ROUND 2", "Use a real feeling"),
        ("ROUND 3", "Change the time"),
    ]
    col = w / 3
    for i, (head, text) in enumerate(labels):
        if i:
            c.setStrokeColor(Color(1, 1, 1, alpha=0.25))
            c.line(x + i * col, y + 8, x + i * col, y + 36)
        c.setFont("WorkSansBold", 6.3)
        c.setFillColor(GREEN if i == 1 else OCHRE if i == 2 else SKY)
        c.drawCentredString(x + col * (i + 0.5), y + 28, head)
        c.setFont("WorkSans", 7.2)
        c.setFillColor(white)
        c.drawCentredString(x + col * (i + 0.5), y + 14, text)


def concept_circuit(path):
    c = canvas.Canvas(str(path), pagesize=(PAGE_W, PAGE_H))
    draw_header(c, "CONCEPT A - GUIDED CIRCUIT", "Six scenes + one reusable conversation route")
    left_x, left_w = 24, 504
    gap = 9
    card_w = (left_w - gap * 2) / 3
    card_h = 202
    top_y = 302
    bottom_y = 91
    for idx, emotion in enumerate(EMOTIONS):
        row = 0 if idx < 3 else 1
        col = idx % 3
        draw_scene_card(c, emotion, left_x + col * (card_w + gap), top_y if row == 0 else bottom_y, card_w, card_h)
    draw_rounds_bar(c, left_x, 38, left_w)
    rail_x, rail_w = 542, PAGE_W - 566
    numbered_stage(c, 1, "Choose", ["Point to a scene and choose one precise word."], rail_x, 442, rail_w, 80, VIOLET)
    numbered_stage(c, 2, "Ask", ["Do you ever feel ___ when...?", "What tends to make you feel ___?"], rail_x, 337, rail_w, 95, CORAL)
    numbered_stage(c, 3, "Build an answer", [
        ("Usually", "I tend to feel ___ when..."),
        ("Recently", "Lately, I've been feeling ___ about..."),
        ("Then", "I felt ___ when..."),
    ], rail_x, 207, rail_w, 120, SKY)
    numbered_stage(c, 4, "Change it", [
        ("Contrast", "I don't feel ___; I feel ___."),
        ("Imagine", "I'd feel ___ if..."),
    ], rail_x, 120, rail_w, 77, OCHRE)
    numbered_stage(c, 5, "Follow up", ["That makes sense.", "What feels most important?", "What would help?", "Thanks for telling me."], rail_x, 20, rail_w, 90, GREEN, dark=True)
    c.showPage()
    c.save()


def concept_ladder(path):
    c = canvas.Canvas(str(path), pagesize=(PAGE_W, PAGE_H))
    draw_header(c, "CONCEPT B - CONVERSATION LADDER", "Scan the scenes, then move left to right")
    x0, total_w, gap = 23, PAGE_W - 46, 7
    card_w = (total_w - gap * 5) / 6
    card_y, card_h = 339, 184
    for idx, emotion in enumerate(EMOTIONS):
        draw_scene_card(c, emotion, x0 + idx * (card_w + gap), card_y, card_w, card_h, compact=True)
    stages = [
        ("1  POINT", VIOLET, ["Choose a scene.", "They seem ___ because..."]),
        ("2  ASK", CORAL, ["Do you ever feel ___ when...?", "What tends to make you feel ___?"]),
        ("3  ANSWER", SKY, ["I tend to feel ___ when...", "Lately, I've been feeling ___ about...", "I felt ___ when..."]),
        ("4  TRANSFORM", OCHRE, ["I don't feel ___; I feel ___.", "Have you felt ___ recently?", "I'd feel ___ if..."]),
        ("5  RESPOND", GREEN, ["That makes sense.", "What feels most important?", "What would help?", "Thanks for telling me."]),
    ]
    stage_y, stage_h, stage_gap = 99, 216, 8
    stage_w = (total_w - stage_gap * 4) / 5
    for idx, (title, color, lines) in enumerate(stages):
        x = x0 + idx * (stage_w + stage_gap)
        round_rect(c, x, stage_y, stage_w, stage_h, 13, fill=CARD, stroke=color, width=1.2)
        c.setFillColor(color)
        c.roundRect(x, stage_y + stage_h - 36, stage_w, 36, 13, fill=1, stroke=0)
        c.rect(x, stage_y + stage_h - 36, stage_w, 18, fill=1, stroke=0)
        c.setFont("WorkSansBold", 8.5)
        c.setFillColor(INK)
        c.drawCentredString(x + stage_w / 2, stage_y + stage_h - 23, title)
        top = stage_y + stage_h - 56
        for j, line in enumerate(lines):
            c.setFillColor(Color(color.red, color.green, color.blue, alpha=0.12))
            box_h = 32 if len(line) > 34 else 27
            c.roundRect(x + 8, top - box_h + 7, stage_w - 16, box_h, 8, fill=1, stroke=0)
            top = draw_wrapped(c, line, x + 14, top, stage_w - 28, "WorkSansBold" if j == 0 else "WorkSans", 7.0, INK, 8.5, 3) - 10
        if idx < 4:
            c.setFillColor(FOREST)
            c.circle(x + stage_w + stage_gap / 2, stage_y + stage_h / 2, 8, fill=1, stroke=0)
            c.setStrokeColor(white)
            c.setLineWidth(1.2)
            c.line(x + stage_w + stage_gap / 2 - 3, stage_y + stage_h / 2, x + stage_w + stage_gap / 2 + 3, stage_y + stage_h / 2)
            c.line(x + stage_w + stage_gap / 2 + 3, stage_y + stage_h / 2, x + stage_w + stage_gap / 2 + 1, stage_y + stage_h / 2 + 2)
            c.line(x + stage_w + stage_gap / 2 + 3, stage_y + stage_h / 2, x + stage_w + stage_gap / 2 + 1, stage_y + stage_h / 2 - 2)
    draw_rounds_bar(c, x0, 42, total_w)
    draw_header_overlay(c, "CONCEPT B - CONVERSATION LADDER", "Scan the scenes, then move left to right")
    c.showPage()
    c.save()


def role_rail(c, title, subtitle, items, x, y, w, h, color):
    round_rect(c, x, y, w, h, 15, fill=CARD, stroke=color, width=1.25)
    c.setFillColor(color)
    c.roundRect(x, y + h - 55, w, 55, 15, fill=1, stroke=0)
    c.rect(x, y + h - 55, w, 22, fill=1, stroke=0)
    c.setFont("PlexSerifBold", 17)
    c.setFillColor(INK)
    c.drawString(x + 13, y + h - 29, title)
    c.setFont("WorkSansBold", 6.2)
    c.drawString(x + 14, y + h - 44, subtitle.upper())
    top = y + h - 75
    for idx, (head, phrases) in enumerate(items, start=1):
        c.setFillColor(color)
        c.circle(x + 16, top + 2, 9, fill=1, stroke=0)
        c.setFont("WorkSansBold", 7)
        c.setFillColor(INK)
        c.drawCentredString(x + 16, top, str(idx))
        c.setFont("WorkSansBold", 7.2)
        c.drawString(x + 31, top, head.upper())
        top -= 16
        for phrase in phrases:
            c.setFillColor(Color(color.red, color.green, color.blue, alpha=0.10))
            lines = wrapped_lines(phrase, "WorkSans", 7, w - 32)
            box_h = 10 + len(lines) * 8.3
            c.roundRect(x + 10, top - box_h + 6, w - 20, box_h, 7, fill=1, stroke=0)
            top = draw_wrapped(c, phrase, x + 16, top, w - 32, "WorkSans", 7, INK, 8.3) - 7
        if idx != len(items):
            c.setStrokeColor(LINE)
            c.line(x + 12, top + 1, x + w - 12, top + 1)
            top -= 14


def concept_console(path):
    c = canvas.Canvas(str(path), pagesize=(PAGE_W, PAGE_H))
    draw_header(c, "CONCEPT C - PARTNER CONSOLE", "Recommended: roles are visible; language stays in the conversation")
    rail_y, rail_h, rail_w = 70, 454, 168
    role_rail(c, "Partner A", "ask + respond", [
        ("Choose", ["Point to any scene."]),
        ("Ask", ["Do you ever feel ___ when...?", "What tends to make you feel ___?"]),
        ("Move time", ["Have you felt ___ recently?", "When did you last feel ___?"]),
        ("Respond", ["That makes sense.", "What feels most important?", "What would help?"]),
    ], 22, rail_y, rail_w, rail_h, CORAL)
    role_rail(c, "Partner B", "answer + expand", [
        ("Name", ["I feel ___ because...", "They seem ___ because..."]),
        ("Build", ["I tend to feel ___ when...", "Lately, I've been feeling ___ about...", "I felt ___ when..."]),
        ("Transform", ["I don't feel ___; I feel ___.", "I'd feel ___ if..."]),
        ("Close", ["Thanks for asking.", "That's all I want to share."]),
    ], PAGE_W - rail_w - 22, rail_y, rail_w, rail_h, SKY)
    center_x = 202
    center_w = PAGE_W - 404
    gap = 7
    card_w = (center_w - gap * 2) / 3
    card_h = 205
    for idx, emotion in enumerate(EMOTIONS):
        row = 0 if idx < 3 else 1
        col = idx % 3
        y = 316 if row == 0 else 104
        draw_scene_card(c, emotion, center_x + col * (card_w + gap), y, card_w, card_h, compact=True)
    round_rect(c, center_x, 70, center_w, 25, 12, fill=FOREST, stroke=FOREST)
    c.setFont("WorkSansBold", 7.2)
    c.setFillColor(white)
    c.drawCentredString(center_x + center_w / 2, 79, "A ASKS  >  B ANSWERS  >  A RESPONDS  >  SWITCH ROLES")
    c.setFont("WorkSansBold", 7)
    c.setFillColor(MUTED)
    c.drawCentredString(PAGE_W / 2, 48, "REAL OR CHARACTER - BOTH COUNT   /   3 ROUNDS: CHARACTER, REAL, CHANGE THE TIME")
    c.showPage()
    c.save()


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    crop_panels()
    concept_circuit(OUT / "feelings-in-motion-concept-a-circuit.pdf")
    concept_ladder(OUT / "feelings-in-motion-concept-b-ladder.pdf")
    concept_console(OUT / "feelings-in-motion-concept-c-partner-console.pdf")


if __name__ == "__main__":
    main()
