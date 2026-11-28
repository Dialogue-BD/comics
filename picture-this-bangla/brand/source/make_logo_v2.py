#!/usr/bin/env python3
"""Bhasha BhAI — faithful vector rebuild of the original logo (bhasha-vai-logo.png).

Master grid: 720 x 720 = the original artwork x4. Every letter is outlined.
Kept from the original: two equal gradient speech bubbles with a darker overlap,
the geometric ভ (headline bar + one spiral stroke ending in a ball), dark-green
"AI", and the two-line italic wordmark with "AI" in bright green.
Minor improvements: clean curves, a dark-ground colourway (the original's
dark-green wordmark vanished on dark), one-ink versions, a horizontal lockup,
favicon and app icon.
"""
import os, shutil
from v2_parts import *

OUT = "/home/claude/bv/v2"
shutil.rmtree(OUT, ignore_errors=True)
os.makedirs(OUT)

# colours sampled from the original
BUB_A, BUB_B = "#8AC95A", "#22B26C"      # bubble gradient, top-left -> bottom-right
OVL_A, OVL_B = "#2AAA4B", "#138540"      # overlap, top -> bottom
GLYPH = "#003615"                        # ভ and AI inside the bubbles
INK = "#033A17"                          # wordmark on light grounds
AI_A, AI_B = "#4ABA52", "#27A24C"        # wordmark "AI", left -> right
INK_DARK = "#F3F8EE"                     # wordmark on dark grounds (minor improvement)
AI_DARK_A, AI_DARK_B = "#7DD67C", "#45C46A"
BLACK, WHITE = "#141714", "#FFFFFF"

L, R = bubble_left(), bubble_right()
OV = inter(L, R)
BHA = bha()
# lettering traced from the original artwork (custom letterforms, no font)
AI_IN = traced("ai_bubble")
W1 = traced("word1")
W2 = traced("word2_bh")
W3 = traced("word2_ai")
WORD_INK = combine(W1, W2)

GRAD = f"""<linearGradient id="bl" gradientUnits="userSpaceOnUse" x1="60" y1="20" x2="380" y2="400"><stop offset="0" stop-color="{BUB_A}"/><stop offset="1" stop-color="{BUB_B}"/></linearGradient>
<linearGradient id="br" gradientUnits="userSpaceOnUse" x1="350" y1="80" x2="670" y2="460"><stop offset="0" stop-color="{BUB_A}"/><stop offset="1" stop-color="{BUB_B}"/></linearGradient>
<linearGradient id="ov" gradientUnits="userSpaceOnUse" x1="0" y1="90" x2="0" y2="350"><stop offset="0" stop-color="{OVL_A}"/><stop offset="1" stop-color="{OVL_B}"/></linearGradient>"""
AI_GRAD = lambda dark: (f'<linearGradient id="ai" gradientUnits="userSpaceOnUse" x1="342" y1="0" x2="533" y2="0">'
                        f'<stop offset="0" stop-color="{AI_DARK_A if dark else AI_A}"/><stop offset="1" stop-color="{AI_DARK_B if dark else AI_B}"/></linearGradient>')

# one-ink mark: both bubbles in ink, a hairline gap where the right bubble
# crosses the left one, letters knocked out
_h = P(); R.draw(_h.getPen()); _h.stroke(14, pathops.LineCap.ROUND_CAP, pathops.LineJoin.ROUND_JOIN, 4); _h.convertConicsToQuads()
GAP_EDGE = inter(union(_h), L)
MONO_MARK = diff(diff(union(L, R), GAP_EDGE), combine(BHA, AI_IN))


def mark(mode):
    if mode == "color":
        return (f'<path fill="url(#bl)" d="{d(L)}"/><path fill="url(#br)" d="{d(R)}"/><path fill="url(#ov)" d="{d(OV)}"/>'
                f'<path fill="{GLYPH}" d="{d(BHA)}"/><path fill="{GLYPH}" d="{d(AI_IN)}"/>')
    return f'<path fill="{BLACK if mode == "black" else WHITE}" d="{d(MONO_MARK)}"/>'


def word(mode, w=(W1, W2, W3)):
    ink = combine(w[0], w[1]) if w[1] is not None else w[0]
    if mode == "adaptive":
        return f'<path class="ink" d="{d(ink)}"/><path class="ai" d="{d(w[2])}"/>'
    if mode in ("light", "dark"):
        return (f'<path fill="{INK if mode == "light" else INK_DARK}" d="{d(ink)}"/>'
                f'<path fill="url(#ai)" d="{d(w[2])}"/>')
    c = BLACK if mode == "black" else WHITE
    return f'<path fill="{c}" d="{d(ink)}"/><path fill="{c}" d="{d(w[2])}"/>'


ADAPT = (f".ink{{fill:{INK}}}.ai{{fill:url(#ai)}}.aid{{display:none}}"
         f"@media (prefers-color-scheme: dark){{.ink{{fill:{INK_DARK}}}.ai{{fill:url(#aid)}}}}")


def svg(name, view, body, defs="", style=""):
    x, y, w, h = view
    st = f"<style>{style}</style>" if style else ""
    df = f"<defs>{defs}</defs>" if defs else ""
    open(f"{OUT}/{name}.svg", "w").write(
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{x:.0f} {y:.0f} {w:.0f} {h:.0f}" role="img" aria-label="Bhasha BhAI">'
        f"<title>Bhasha BhAI</title>{st}{df}{body}</svg>\n")


def defs_for(mode, word_used=True):
    out = GRAD if mode not in ("black", "white") else ""
    if word_used and mode in ("light", "dark"):
        out += AI_GRAD(mode == "dark")
    if word_used and mode == "adaptive":
        out += AI_GRAD(False) + AI_GRAD(True).replace('id="ai"', 'id="aid"')
    return out


MARK_MODE = {"adaptive": "color", "light": "color", "dark": "color", "black": "black", "white": "white"}
SUFFIX = {"adaptive": "Adaptive", "light": "On-Light", "dark": "On-Dark", "black": "Mono-Black", "white": "Mono-White"}
CODE = {"adaptive": "", "light": "A", "dark": "B", "black": "C", "white": "D"}

# 01 primary stacked lockup — the original composition
FULL = (24, 0, 672, 724)
for m in SUFFIX:
    svg(f"01{CODE[m]}-Bhasha-BhAI-Logo-{SUFFIX[m]}", FULL, mark(MARK_MODE[m]) + word(m), defs_for(m), ADAPT if m == "adaptive" else "")

# 02 horizontal lockup — mark left, one-line wordmark right (for page headers)
HS = 0.62                                # mark scale
mx0, my0, mx1, my1 = union(L, R).bounds
# one line: traced "Bhasha" + traced "BhAI" (line 2 moved up onto line 1's baseline)
b1 = W1.bounds; b2 = W2.bounds; b3 = W3.bounds
base1, base2 = b1[3], max(b2[3], b3[3])
cap = b1[3] - b1[1]
gap = cap * 0.30
dx2 = b1[2] + gap - b2[0]
dy2 = base1 - base2
WS = (my1 - my0) * HS * 0.42 / cap          # wordmark cap height = 42 % of the mark height
gx = (mx1 - mx0) * HS + 40
oy = (my1 - my0) * HS * 0.5 - (b1[1] + cap / 2) * WS
ox = gx - b1[0] * WS
hb = moved(W1, ox, oy, WS)
hbh = moved(moved(W2, dx2, dy2), ox, oy, WS)
hai = moved(moved(W3, dx2, dy2), ox, oy, WS)
aix = hai.bounds[0]
HW = hai.bounds[2] + 16
HH = (my1 - my0) * HS
mark_g = lambda mm: f'<g transform="translate({-mx0 * HS:.2f} {-my0 * HS:.2f}) scale({HS})">{mark(mm)}</g>'
for m in SUFFIX:
    defs = defs_for(m).replace('x1="342" y1="0" x2="533"', f'x1="{aix:.1f}" y1="0" x2="{hai.bounds[2]:.1f}"')
    svg(f"02{CODE[m]}-Bhasha-BhAI-Logo-Horizontal-{SUFFIX[m]}", (0, -8, HW, HH + 16),
        mark_g(MARK_MODE[m]) + word(m, (hb, hbh, hai)), defs, ADAPT if m == "adaptive" else "")

# 03 logomark — the two bubbles; works unchanged on light and dark
MV = (mx0 - 12, my0 - 12, mx1 - mx0 + 24, my1 - my0 + 24)
svg("03A-Bhasha-BhAI-Logomark", MV, mark("color"), GRAD)
svg("03B-Bhasha-BhAI-Logomark-Mono-Black", MV, mark("black"))
svg("03C-Bhasha-BhAI-Logomark-Mono-White", MV, mark("white"))

# 04 favicon — the ভ bubble alone; the pair turns to mush below ~40 px
lb = L.bounds
side = max(lb[2] - lb[0], lb[3] - lb[1]) + 16
FV = (lb[0] - (side - (lb[2] - lb[0])) / 2, lb[1] - (side - (lb[3] - lb[1])) / 2, side, side)
svg("04-Bhasha-BhAI-Favicon", FV, f'<path fill="url(#bl)" d="{d(L)}"/><path fill="{GLYPH}" d="{d(BHA)}"/>', GRAD)

# 05 app icon — logomark on a white rounded tile (reads on light and dark home screens)
T = 720
k = 0.80 * T / (mx1 - mx0)
tx = (T - (mx1 - mx0) * k) / 2 - mx0 * k
ty = (T - (my1 - my0) * k) / 2 - my0 * k + 6
svg("05-Bhasha-BhAI-App-Icon", (0, 0, T, T),
    f'<rect width="{T}" height="{T}" rx="162" fill="#FFFFFF"/><g transform="translate({tx:.2f} {ty:.2f}) scale({k:.4f})">{mark("color")}</g>', GRAD)

print(sorted(os.listdir(OUT)))
