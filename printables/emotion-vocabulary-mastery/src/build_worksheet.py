from pathlib import Path

from reportlab.lib.colors import Color, HexColor, white
from reportlab.lib.pagesizes import A4, landscape
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
OUT_PDF = ROOT / "output" / "pdf"
PAGE_W, PAGE_H = landscape(A4)

FONT_DIR = Path("/Users/timothyhall/.codex/plugins/cache/claude-cowork/anthropic-skills/1.0.0/skills/canvas-design/canvas-fonts")
pdfmetrics.registerFont(TTFont("WorkSans", str(FONT_DIR / "WorkSans-Regular.ttf")))
pdfmetrics.registerFont(TTFont("WorkSansBold", str(FONT_DIR / "WorkSans-Bold.ttf")))
pdfmetrics.registerFont(TTFont("WorkSansItalic", str(FONT_DIR / "WorkSans-Italic.ttf")))
pdfmetrics.registerFont(TTFont("PlexSerifBold", str(FONT_DIR / "IBMPlexSerif-Bold.ttf")))

PAPER = HexColor("#F6F0E3")
CARD = HexColor("#FFFDF8")
INK = HexColor("#17261F")
MUTED = HexColor("#65716B")
LINE = HexColor("#D9D6CC")
FOREST = HexColor("#17372B")


FAMILIES = [
    {
        "family": "FEAR",
        "signal": "UNCERTAINTY / THREAT",
        "color": HexColor("#A77AC2"),
        "targets": [
            {
                "word": "ANXIOUS",
                "partners": ["deeply / visibly anxious", "anxious thoughts | mounting anxiety"],
                "patterns": ["anxious about + NOUN", "anxious that + CLAUSE", "too anxious to + VERB"],
                "contrast": ["worried = a problem repeats in your mind", "anxious = uncertain tension", "scared = danger feels present"],
                "dialogue": ["A  You seem on edge. What's up?", "B  I'm anxious about the viva.", "    I can't switch off."],
                "concept": "TENSION / ALERT",
                "idioms": ["on edge | a knot in my stomach", "hanging over me"],
            },
            {
                "word": "OVERWHELMED",
                "partners": ["completely overwhelmed", "overwhelming workload | sheer volume"],
                "patterns": ["overwhelmed by + CAUSE", "overwhelmed with + TASKS", "too overwhelmed to + VERB"],
                "contrast": ["busy = much to do", "overwhelmed = more than I can manage"],
                "dialogue": ["A  You look swamped.", "B  Deadlines are piling up.", "    I don't know where to start."],
                "concept": "LOAD > CAPACITY",
                "idioms": ["snowed under | swamped", "my plate is full | piling up"],
            },
        ],
    },
    {
        "family": "ANGER",
        "signal": "WRONG / BLOCKED",
        "color": HexColor("#E4765F"),
        "targets": [
            {
                "word": "FRUSTRATED",
                "partners": ["deeply / increasingly frustrated", "growing frustration | frustrating delay"],
                "patterns": ["frustrated with + PERSON/SYSTEM", "frustrated by/at + CAUSE", "frustrated that + CLAUSE"],
                "contrast": ["annoyed = bothered", "frustrated = blocked", "furious = extreme anger"],
                "dialogue": ["A  Any progress?", "B  Not really. I keep hitting a wall", "    with the registration system."],
                "concept": "BLOCKED MOTION",
                "idioms": ["hit a wall | stuck in a loop", "at the end of my rope"],
            },
            {
                "word": "HURT",
                "partners": ["deeply / visibly hurt", "hurt feelings | a hurt expression"],
                "patterns": ["hurt by + ACTION", "hurt that + CLAUSE", "it hurts to + VERB"],
                "contrast": ["anger pushes back against a problem", "hurt registers emotional pain"],
                "dialogue": ["A  You went quiet.", "B  That comment hit a nerve.", "    I felt brushed aside."],
                "concept": "EMOTION = INJURY",
                "idioms": ["hit a nerve | cut deep", "it still stings | bruised feelings"],
            },
        ],
    },
    {
        "family": "SURPRISE",
        "signal": "THE UNEXPECTED",
        "color": HexColor("#D99B3F"),
        "targets": [
            {
                "word": "STARTLED",
                "partners": ["visibly startled | easily startled", "startled look | sudden start"],
                "patterns": ["startled by + SOUND/EVENT", "startled to + VERB", "startled when + CLAUSE"],
                "contrast": ["surprised = something was unexpected", "startled = a sudden body reaction", "frightened = danger is included"],
                "dialogue": ["A  You jumped!", "B  That bang caught me off guard.", "    It made me jump."],
                "concept": "SUDDEN IMPACT",
                "idioms": ["caught off guard | made me jump", "jumped out of my skin"],
            },
            {
                "word": "AMAZED",
                "partners": ["genuinely / absolutely amazed", "amazement | an amazed expression"],
                "patterns": ["amazed by/at + NOUN", "amazed to + VERB", "amazed that + CLAUSE"],
                "contrast": ["surprised = unexpected", "amazed = unexpected + impressive"],
                "dialogue": ["A  Did you see her result?", "B  Yes - my jaw dropped.", "    She absolutely smashed it."],
                "concept": "IMPACT / OPENING",
                "idioms": ["blew me away | my jaw dropped", "took my breath away"],
            },
        ],
    },
    {
        "family": "HAPPY",
        "signal": "GAIN / POSSIBILITY",
        "color": HexColor("#D7BB45"),
        "targets": [
            {
                "word": "PROUD",
                "partners": ["immensely / quietly proud", "proud moment | a sense of pride"],
                "patterns": ["proud of + NOUN/-ING", "proud to + VERB", "proud that + CLAUSE"],
                "contrast": ["pleased = satisfied", "proud = value from achievement/identity", "arrogant = claims superiority"],
                "dialogue": ["A  You must be proud.", "B  I am. All that hard work", "    finally paid off."],
                "concept": "PRIDE IS HEIGHT",
                "idioms": ["hold your head high | stand tall", "a feather in your cap"],
            },
            {
                "word": "OPTIMISTIC",
                "partners": ["cautiously / genuinely optimistic", "optimistic outlook | renewed optimism"],
                "patterns": ["optimistic about + NOUN", "optimistic that + CLAUSE", "remain optimistic despite + NOUN"],
                "contrast": ["hopeful = wants a good outcome", "optimistic = expects one is possible"],
                "dialogue": ["A  Do you think it'll work?", "B  I'm cautiously optimistic.", "    Things are looking up."],
                "concept": "GOOD IS LIGHT / UP",
                "idioms": ["look on the bright side", "light at the end of the tunnel", "things are looking up"],
            },
        ],
    },
    {
        "family": "DISGUST",
        "signal": "REJECTION / VIOLATION",
        "color": HexColor("#63B87B"),
        "targets": [
            {
                "word": "DISGUSTED",
                "partners": ["utterly / visibly disgusted", "deep disgust | moral disgust"],
                "patterns": ["disgusted by/at + NOUN/-ING", "disgusted with + PERSON/SYSTEM", "disgusted that + CLAUSE"],
                "contrast": ["dislike = a negative preference", "disgust = a strong urge to reject/move away"],
                "dialogue": ["A  Did you read the report?", "B  Yes. The corruption left", "    a bad taste in my mouth."],
                "concept": "BAD = CONTAMINATION",
                "idioms": ["turns my stomach | a bad taste", "I can't stomach it"],
            },
            {
                "word": "DISAPPOINTED",
                "partners": ["deeply / bitterly disappointed", "disappointed tone | crushing disappointment"],
                "patterns": ["disappointed in + PERSON", "disappointed with/by + RESULT/EVENT", "disappointed that + CLAUSE"],
                "contrast": ["sad = emotional pain or loss", "disappointed = reality < expectation"],
                "dialogue": ["A  How did the interview go?", "B  I didn't get it.", "    It was a real letdown."],
                "concept": "EXPECTATION = HEIGHT",
                "idioms": ["a letdown | hopes were dashed", "fell short | didn't live up to"],
            },
        ],
    },
    {
        "family": "SAD",
        "signal": "LOSS / DISCONNECTION",
        "color": HexColor("#62AFCF"),
        "targets": [
            {
                "word": "LONELY",
                "partners": ["painfully / intensely lonely", "lonely night | deep loneliness"],
                "patterns": ["lonely without + PERSON", "lonely in/among + GROUP", "lonely even when + CLAUSE"],
                "contrast": ["alone = without company", "lonely = unwanted lack of connection"],
                "dialogue": ["A  Settling in okay?", "B  Not really. I feel out of place,", "    even in a crowd."],
                "concept": "DISCONNECTION = DISTANCE",
                "idioms": ["out of place | cut off", "on the outside looking in"],
            },
            {
                "word": "GUILTY",
                "partners": ["deeply guilty | lingering guilt", "guilty conscience | a pang of guilt"],
                "patterns": ["guilty about/for + NOUN/-ING", "guilty of + OFFENCE", "guilty that + CLAUSE"],
                "contrast": ["guilt: I did something wrong", "shame: there is something wrong with me"],
                "dialogue": ["A  Why are you avoiding her?", "B  I let her down, and it's been", "    eating away at me."],
                "concept": "GUILT = WEIGHT / DEBT",
                "idioms": ["weigh on my conscience", "eat away at me | make it up to her"],
            },
        ],
    },
]


def tint(color, amount=0.88):
    return Color(
        color.red + (1 - color.red) * amount,
        color.green + (1 - color.green) * amount,
        color.blue + (1 - color.blue) * amount,
    )


def round_rect(c, x, y, w, h, radius=8, fill=CARD, stroke=LINE, width=0.65):
    c.setFillColor(fill)
    c.setStrokeColor(stroke)
    c.setLineWidth(width)
    c.roundRect(x, y, w, h, radius, fill=1, stroke=1)


def fit_size(text, font, start, max_width, minimum=4.5):
    size = start
    while size > minimum and pdfmetrics.stringWidth(text, font, size) > max_width:
        size -= 0.15
    return size


def split_lines(text, font, size, max_width):
    words = text.split()
    lines, current = [], ""
    for word in words:
        test = f"{current} {word}".strip()
        if current and pdfmetrics.stringWidth(test, font, size) > max_width:
            lines.append(current)
            current = word
        else:
            current = test
    if current:
        lines.append(current)
    return lines


def draw_lines(c, lines, x, top, width, font="WorkSans", size=5.75, color=INK, leading=6.8):
    c.setFont(font, size)
    c.setFillColor(color)
    cursor = top
    for raw in lines:
        for line in split_lines(raw, font, size, width):
            c.drawString(x, cursor, line)
            cursor -= leading
    return cursor


def section(c, number, label, lines, x, top, width, color, italic=False):
    c.setFillColor(color)
    c.circle(x + 3.2, top + 1.2, 3.2, fill=1, stroke=0)
    c.setFont("WorkSansBold", 4.6)
    c.setFillColor(FOREST)
    c.drawCentredString(x + 3.2, top - 0.5, str(number))
    c.setFont("WorkSansBold", 5.0)
    c.setFillColor(MUTED)
    c.drawString(x + 9, top - 0.7, label)
    return draw_lines(
        c,
        lines,
        x,
        top - 8.2,
        width,
        "WorkSansItalic" if italic else "WorkSans",
        5.55,
        INK,
        6.45,
    ) - 3.1


def draw_target(c, target, x, y, w, h, color):
    c.setFillColor(tint(color, 0.92))
    c.roundRect(x, y, w, h, 7, fill=1, stroke=0)
    c.setStrokeColor(Color(color.red, color.green, color.blue, alpha=0.35))
    c.setLineWidth(0.55)
    c.roundRect(x, y, w, h, 7, fill=0, stroke=1)

    c.setFont("PlexSerifBold", fit_size(target["word"], "PlexSerifBold", 10.2, w - 17))
    c.setFillColor(INK)
    c.drawString(x + 7, y + h - 15, target["word"])
    c.setStrokeColor(color)
    c.setLineWidth(1.5)
    c.line(x + 7, y + h - 19, x + w - 7, y + h - 19)

    cursor = y + h - 29
    inner_x, inner_w = x + 7, w - 14
    cursor = section(c, 1, "COLLOCATE / word partners", target["partners"], inner_x, cursor, inner_w, color)
    cursor = section(c, 2, "COLLIGATE / grammar slots", target["patterns"], inner_x, cursor, inner_w, color)
    cursor = section(c, 3, "NEGOTIATE / nearby meanings", target["contrast"], inner_x, cursor, inner_w, color)
    cursor = section(c, 4, "DIALOGUE / make it social", target["dialogue"], inner_x, cursor, inner_w, color, italic=True)
    c.setFillColor(color)
    c.circle(inner_x + 3.2, cursor + 1.2, 3.2, fill=1, stroke=0)
    c.setFont("WorkSansBold", 4.6)
    c.setFillColor(FOREST)
    c.drawCentredString(inner_x + 3.2, cursor - 0.5, "5")
    c.setFont("WorkSansBold", 5.0)
    c.setFillColor(MUTED)
    c.drawString(inner_x + 9, cursor - 0.7, "MAP THE CONCEPT")
    cursor -= 8.2
    c.setFillColor(color)
    c.setFont("WorkSansBold", fit_size(target["concept"], "WorkSansBold", 5.65, inner_w))
    c.drawString(inner_x, cursor, target["concept"])
    cursor -= 6.9
    draw_lines(c, target["idioms"], inner_x, cursor, inner_w, "WorkSans", 5.5, INK, 6.35)


def draw_family(c, family, x, y, w, h):
    color = family["color"]
    round_rect(c, x, y, w, h, 10, fill=CARD, stroke=color, width=1.1)
    c.setFillColor(color)
    c.roundRect(x, y + h - 25, w, 25, 10, fill=1, stroke=0)
    c.rect(x, y + h - 25, w, 12.5, fill=1, stroke=0)
    c.setFont("WorkSansBold", 8.4)
    c.setFillColor(INK)
    c.drawString(x + 9, y + h - 16.7, family["family"])
    c.setFont("WorkSansBold", 4.8)
    c.drawRightString(x + w - 9, y + h - 16, family["signal"])

    inner_gap = 6
    target_w = (w - 18 - inner_gap) / 2
    target_y = y + 7
    target_h = h - 38
    for idx, target in enumerate(family["targets"]):
        draw_target(c, target, x + 6 + idx * (target_w + inner_gap), target_y, target_w, target_h, color)


def draw_header(c):
    c.setFillColor(PAPER)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    c.setFillColor(FOREST)
    c.rect(0, PAGE_H - 7, PAGE_W, 7, fill=1, stroke=0)

    c.setFont("PlexSerifBold", 23)
    c.setFillColor(INK)
    c.drawString(20, PAGE_H - 35, "HOW A WORD BECOMES YOURS")
    c.setFont("WorkSansBold", 6.2)
    c.setFillColor(MUTED)
    c.drawString(22, PAGE_H - 48, "12 EMOTIONS  /  6 FAMILIES  /  ONE REPEATABLE PATH FROM WORD TO CONCEPT")

    path_x, path_y, path_w, path_h = 470, PAGE_H - 51, PAGE_W - 490, 34
    round_rect(c, path_x, path_y, path_w, path_h, 10, fill=FOREST, stroke=FOREST)
    steps = ["WORD", "PARTNERS", "PATTERN", "CONTRAST", "DIALOGUE", "CONCEPT"]
    col = path_w / len(steps)
    for idx, step in enumerate(steps):
        if idx:
            c.setStrokeColor(Color(1, 1, 1, alpha=0.28))
            c.line(path_x + idx * col, path_y + 7, path_x + idx * col, path_y + path_h - 7)
        c.setFont("WorkSansBold", fit_size(step, "WorkSansBold", 5.0, col - 4))
        c.setFillColor(white)
        c.drawCentredString(path_x + (idx + 0.5) * col, path_y + 18, step)
        c.setFont("WorkSans", 4.3)
        c.setFillColor(HexColor("#CDE0D5"))
        c.drawCentredString(path_x + (idx + 0.5) * col, path_y + 9, str(idx + 1))

    key_x, key_y, key_w, key_h = 20, 510, PAGE_W - 40, 27
    round_rect(c, key_x, key_y, key_w, key_h, 8, fill=CARD, stroke=LINE, width=0.7)
    keys = [
        ("COLLOCATE", "Which words prefer each other?"),
        ("COLLIGATE", "Which grammar slot does it prefer?"),
        ("NEGOTIATE", "Which nearby meaning fits best?"),
        ("DIALOGUE", "What would a person actually say?"),
        ("MAP", "Which metaphor carries the concept?"),
    ]
    key_col = key_w / len(keys)
    colors = [family["color"] for family in FAMILIES[:5]]
    for idx, ((head, detail), color) in enumerate(zip(keys, colors)):
        x = key_x + idx * key_col
        if idx:
            c.setStrokeColor(LINE)
            c.line(x, key_y + 5, x, key_y + key_h - 5)
        c.setFillColor(color)
        c.circle(x + 12, key_y + 13.5, 4, fill=1, stroke=0)
        c.setFont("WorkSansBold", 5.5)
        c.setFillColor(INK)
        c.drawString(x + 20, key_y + 16, head)
        c.setFont("WorkSans", fit_size(detail, "WorkSans", 5.2, key_col - 27))
        c.setFillColor(MUTED)
        c.drawString(x + 20, key_y + 7.5, detail)


def draw_footer(c):
    y = 15
    c.setFillColor(FOREST)
    c.roundRect(20, y, PAGE_W - 40, 36, 10, fill=1, stroke=0)
    c.setFont("WorkSansBold", 5.8)
    c.setFillColor(HexColor("#EECF67"))
    c.drawString(32, y + 23, "PAIR MASTERY LOOP")
    c.setFont("WorkSans", 5.8)
    c.setFillColor(white)
    c.drawString(32, y + 12, "A points to a word  >  B builds one pattern  >  A asks: 'Do you mean ___ or ___?'  >  B clarifies  >  perform the dialogue  >  explain one idiom")

    c.setFont("WorkSansBold", 5.7)
    c.setFillColor(HexColor("#8CD5A8"))
    c.drawRightString(PAGE_W - 32, y + 23, "MASTERED = YOU CAN NOTICE + BUILD + DISTINGUISH + USE + TRANSFER")
    c.setFont("WorkSans", 4.8)
    c.setFillColor(HexColor("#CDE0D5"))
    c.drawRightString(PAGE_W - 32, y + 5, "SAY IT - DO NOT WRITE ON THIS PAGE  /  SWITCH AFTER EACH WORD")


def build(path):
    c = canvas.Canvas(str(path), pagesize=(PAGE_W, PAGE_H))
    draw_header(c)

    margin_x, gap_x = 20, 8
    card_w = (PAGE_W - margin_x * 2 - gap_x * 2) / 3
    card_h, gap_y = 218, 8
    bottom_y = 59
    top_y = bottom_y + card_h + gap_y
    for idx, family in enumerate(FAMILIES):
        row = 0 if idx < 3 else 1
        col = idx % 3
        x = margin_x + col * (card_w + gap_x)
        y = top_y if row == 0 else bottom_y
        draw_family(c, family, x, y, card_w, card_h)

    draw_footer(c)
    c.showPage()
    c.save()


def main():
    OUT_PDF.mkdir(parents=True, exist_ok=True)
    build(OUT_PDF / "emotion-vocabulary-mastery-map.pdf")


if __name__ == "__main__":
    main()
