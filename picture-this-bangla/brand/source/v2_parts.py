"""Shared geometry for the faithful Bhasha BhAI rebuild (720 x 720 master grid = original logo x4)."""
import pathops
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen

F = "/home/claude/bv/fonts"
EXO_I = TTFont(f"{F}/exo-2/package/files/exo-2-latin-700-italic.woff")
MS_800 = TTFont(f"{F}/ms/package/files/montserrat-latin-800-normal.woff")
EXO_800 = TTFont(f"{F}/exo-2/package/files/exo-2-latin-800-normal.woff") if False else None


def P():
    return pathops.Path()


def union(*ps):
    b = pathops.OpBuilder()
    for p in ps:
        b.add(p, pathops.PathOp.UNION)
    return b.resolve()


def combine(*ps):
    """Merge non-overlapping shapes without a boolean op (keeps letter counters)."""
    out = P()
    for p in ps:
        out.addPath(p)
    return out


def inter(a, b):
    return pathops.op(a, b, pathops.PathOp.INTERSECTION)


def diff(a, b):
    return pathops.op(a, b, pathops.PathOp.DIFFERENCE)


def stroked(build, width, cap=pathops.LineCap.ROUND_CAP):
    p = P()
    build(p)
    p.stroke(width, cap, pathops.LineJoin.ROUND_JOIN, 4)
    p.convertConicsToQuads()
    return union(p)


def circle(cx, cy, r):
    k = 0.5523 * r
    p = P()
    p.moveTo(cx + r, cy)
    p.cubicTo(cx + r, cy + k, cx + k, cy + r, cx, cy + r)
    p.cubicTo(cx - k, cy + r, cx - r, cy + k, cx - r, cy)
    p.cubicTo(cx - r, cy - k, cx - k, cy - r, cx, cy - r)
    p.cubicTo(cx + k, cy - r, cx + r, cy - k, cx + r, cy)
    p.close()
    return p


def rect(x0, y0, x1, y1):
    p = P()
    p.moveTo(x0, y0); p.lineTo(x1, y0); p.lineTo(x1, y1); p.lineTo(x0, y1); p.close()
    return p


def rrect(x, y, w, h, r):
    k = 0.5523 * r
    p = P()
    p.moveTo(x + r, y); p.lineTo(x + w - r, y)
    p.cubicTo(x + w - r + k, y, x + w, y + r - k, x + w, y + r)
    p.lineTo(x + w, y + h - r)
    p.cubicTo(x + w, y + h - r + k, x + w - r + k, y + h, x + w - r, y + h)
    p.lineTo(x + r, y + h)
    p.cubicTo(x + r - k, y + h, x, y + h - r + k, x, y + h - r)
    p.lineTo(x, y + r)
    p.cubicTo(x, y + r - k, x + r - k, y, x + r, y)
    p.close()
    return p


def poly(pts, quads=None):
    p = P()
    p.moveTo(*pts[0])
    for q in pts[1:]:
        p.lineTo(*q)
    p.close()
    return p


def text_path(font, text, size, x, y, tracking=0.0):
    """Outline text. Each glyph is cleaned on its own (merging glyphs in one op
    dropped the A's counter), then the glyphs are combined without an op."""
    upm = font["head"].unitsPerEm
    gs, cm = font.getGlyphSet(), font.getBestCmap()
    s = size / upm
    out = P(); cx = x
    for ch in text:
        g = gs[cm[ord(ch)]]
        gp = P()
        g.draw(TransformPen(gp.getPen(), (s, 0, 0, -s, cx, y)))
        gp = union(gp)
        out.addPath(gp)
        cx += g.width * s + tracking * size
    return out


def fit_text(font, text, box, tracking=0.0):
    """Scale text so its ink bbox matches box=(x0,y0,x1,y1) width, baseline at box bottom."""
    probe = text_path(font, text, 1000, 0, 0, tracking)
    bx0, by0, bx1, by1 = probe.bounds
    s = (box[2] - box[0]) / (bx1 - bx0)
    size = 1000 * s
    return text_path(font, text, size, box[0] - bx0 * s, box[3] - by1 * s, tracking), size


def d(path):
    pen = SVGPathPen(None, ntos=lambda v: f"{v:.2f}".rstrip("0").rstrip("."))
    path.draw(pen)
    return pen.getCommands()


# ---------------- bubbles ----------------
def bubble_left():
    body = rrect(36, 11, 360, 346, 100)
    tail = P()
    tail.moveTo(112, 300); tail.lineTo(112, 412)
    tail.quadTo(150, 378, 192, 352); tail.lineTo(192, 300); tail.close()
    return union(body, tail)


def bubble_right():
    body = rrect(330, 70, 353, 344, 100)
    tail = P()
    tail.moveTo(616, 350); tail.lineTo(616, 462)
    tail.quadTo(586, 432, 548, 410); tail.lineTo(548, 350); tail.close()
    return union(body, tail)


# ---------------- ভ (geometric, as drawn in the original) ----------------
def bha():
    """ভ: traced from the original artwork (16x, smoothed) below an exact headline bar."""
    from fontTools.svgLib.path import parse_path
    body = P()
    parse_path(open("/home/claude/bv/bha_traced.d").read(), body.getPen())
    body = union(body)
    out = P()
    out.addPath(union(rect(96, 88, 331, 121)))
    out.addPath(body)
    return out


# ---------------- traced lettering (custom, from the original artwork) ----------------
import json as _json
_TRACED = _json.load(open("/home/claude/bv/traced_text.json"))


def traced(name):
    from fontTools.svgLib.path import parse_path
    q = P()
    parse_path(_TRACED[name], q.getPen())
    return q


def moved(path, dx=0.0, dy=0.0, k=1.0):
    q = P()
    path.draw(TransformPen(q.getPen(), (k, 0, 0, k, dx, dy)))
    return q
