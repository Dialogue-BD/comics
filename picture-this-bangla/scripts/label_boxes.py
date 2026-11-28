#!/usr/bin/env python3
"""Find where each picture's word is printed in the word list at the bottom of a
Picture This card front, and write label-boxes.js for the Hint highlight.

  python3 label_boxes.py bn <picture-this-bangla dir>   # uses cards/*/card.json label_order
  python3 label_boxes.py en <picture-this dir>          # uses game-data.js labels

Needs Tesseract with the eng and ben models (TESSDATA_PREFIX pointing at them),
pytesseract, numpy and Pillow.

Output: <dir>/label-boxes.js = window.PT_LABEL_BOXES = {cardId: [[left, top,
width, height] x 6]} in % of the front image, in the card's item order.

How it works, per card (first method that finds all six wins):
 1. OCR the bottom of the card and match each known label to a run of words
    (fuzzy, so small OCR slips are fine).
 2. Bangla only: split the bottom lines at the commas and map the pieces to
    card.json's label_order (the printed order).
 3. Bangla only, one-word labels: split each of the three lines at its widest
    gap in the ink, and map to label_order.
Cards that fail all three are reported and left out (no highlight on them).
"""
import difflib, glob, json, os, re, sys
import numpy as np
import pytesseract
from PIL import Image

TOP = 0.72          # crop the card from here down
FOOTER = 0.79       # the word list starts below this line
norm = lambda s: re.sub(r"[\s,.;:!?'\"“”‘’()\-–—।]", "", s).lower()


def tokens(im, lang, psm, scale=1):
    if scale != 1:
        im = im.resize((im.width * scale, im.height * scale))
    d = pytesseract.image_to_data(im, lang=lang, config=f"--psm {psm}", output_type=pytesseract.Output.DICT)
    return [(d["text"][i], d["left"][i] / scale, d["top"][i] / scale, d["width"][i] / scale, d["height"][i] / scale,
             (d["block_num"][i], d["par_num"][i], d["line_num"][i]))
            for i in range(len(d["text"])) if d["text"][i].strip()]


def box(ts):
    return (min(t[1] for t in ts), min(t[2] for t in ts),
            max(t[1] + t[3] for t in ts), max(t[2] + t[4] for t in ts))


def by_labels(im, lang, labels):
    for psm in (6, 4, 11):
        toks = tokens(im, lang, psm)
        found, used = {}, set()
        for li in sorted(range(6), key=lambda k: -len(norm(labels[k]))):
            target, cands = norm(labels[li]), []
            for a in range(len(toks)):
                s = ""
                for b in range(a, min(a + 5, len(toks))):
                    if b > a and toks[b][5] != toks[a][5]:
                        break
                    s += norm(toks[b][0])
                    r = difflib.SequenceMatcher(None, s, target).ratio()
                    if r >= 0.7 and not used.intersection(range(a, b + 1)):
                        cands.append((r, a, b))
            if cands:
                best = max(c[0] for c in cands)
                r, a, b = max((c for c in cands if c[0] >= best - 0.05), key=lambda c: toks[c[1]][2])
                used.update(range(a, b + 1))
                found[li] = box(toks[a:b + 1])
        if len(found) == 6:
            return [found[i] for i in range(6)]
    return None


def by_commas(im, labels, order, ymin):
    for psm in (6, 4, 11, 3):
        for scale in (1, 2):
            toks = [t for t in tokens(im, "ben", psm, scale) if t[2] >= ymin]
            toks.sort(key=lambda t: (round((t[2] + t[4] / 2) / 40), t[1]))
            groups, cur = [], []
            for t in toks:
                cur.append(t)
                if t[0].rstrip().endswith(","):
                    groups.append(cur)
                    cur = []
            if cur:
                groups.append(cur)
            if len(groups) == 6:
                out = [None] * 6
                for gi, ts in enumerate(groups):
                    out[labels.index(order[gi])] = box(ts)
                return out
    return None


def by_ink(im, labels, order, ymin):
    ink = np.array(im.convert("L")) < 110
    rows = ink[ymin:].sum(1) > 0
    runs, i = [], 0
    while i < len(rows):
        if rows[i]:
            j = i
            while j < len(rows) and rows[j]:
                j += 1
            if j - i > 15:
                runs.append((i + ymin, j + ymin))
            i = j
        else:
            i += 1
    if len(runs) != 3 or any(" " in l for l in labels):
        return None
    out, k = [None] * 6, 0
    for y0, y1 in runs:
        cols = ink[y0:y1].sum(0) > 0
        xs = np.flatnonzero(cols)
        gaps, i = [], xs[0]
        while i <= xs[-1]:
            if not cols[i]:
                j = i
                while j <= xs[-1] and not cols[j]:
                    j += 1
                gaps.append((j - i, i, j))
                i = j
            else:
                i += 1
        g = max(gaps)
        for s, e in ((xs[0], g[1]), (g[2], xs[-1] + 1)):
            out[labels.index(order[k])] = (s, y0, e, y1)
            k += 1
    return out


def main():
    lang, root = sys.argv[1], sys.argv[2]
    if lang == "bn":
        deck = json.loads(open(f"{root}/deck-data.js", encoding="utf-8").read()
                          .split("window.PTB_DECK = ", 1)[1].split(";\nwindow.")[0].strip().rstrip(";"))
        orders = {}
        for p in glob.glob(f"{root}/cards/*/card.json"):
            c = json.load(open(p, encoding="utf-8"))
            orders[c["slug"]] = c.get("label_order")
        jobs = [(c["id"], f"{root}/{c['front']}", [i["label"] for i in c["items"]], orders.get(c["id"])) for c in deck["cards"]]
    else:
        game = json.loads(open(f"{root}/game-data.js", encoding="utf-8").read()
                          .split("window.PICTURE_THIS_GAME_DATA = ", 1)[1].split("};", 1)[0] + "}")
        jobs = [(c["id"], f"{root}/{c['front']}", game.get(c["id"], []), None) for c in json.load(open(f"{root}/cards.json"))]
    result, failed = {}, []
    for cid, path, labels, order in jobs:
        if len(labels) != 6:
            continue
        full = Image.open(path)
        W, H = full.size
        top = int(H * TOP)
        im = full.convert("L").crop((0, top, W, H))
        ymin = int(H * FOOTER) - top - 10
        boxes = by_labels(im, "ben" if lang == "bn" else "eng", labels)
        if boxes is None and order and sorted(order) == sorted(labels):
            boxes = by_commas(im, labels, order, ymin) or by_ink(im, labels, order, int(H * FOOTER) - top)
        if boxes is None:
            failed.append(cid)
            continue
        pad = 4
        result[cid] = [[round((x0 - pad) / W * 100, 2), round((y0 + top - pad) / H * 100, 2),
                        round((x1 - x0 + 2 * pad) / W * 100, 2), round((y1 - y0 + 2 * pad) / H * 100, 2)]
                       for x0, y0, x1, y1 in boxes]
    head = ("// Where each picture's word is printed in the word list at the bottom of the card front.\n"
            "// [left, top, width, height] in % of the front image, in the same order as the card's six items.\n"
            "// Generated from the card images by scripts/label_boxes.py (OCR); rerun it after adding cards.\n")
    body = "window.PT_LABEL_BOXES = " + json.dumps(result, ensure_ascii=False, separators=(",", ":")).replace('],"', '],\n"') + ";\n"
    open(f"{root}/label-boxes.js", "w", encoding="utf-8").write(head + body)
    print(f"{len(result)} cards written; no boxes for {len(failed)}: {failed}")


if __name__ == "__main__":
    main()
