#!/usr/bin/env python3
"""
Merge one annotated page into the viewer.

Usage:
    python3 merge_page.py <page_number> <page_data.py>

<page_data.py> must define P = [ (name, [ymin,xmin,ymax,xmax], subject, verb, rest, plural), ... ]
where box values are percentages 0-100, verb is a BARE INFINITIVE ("fly") and
rest is the remainder of the phrase ("over the snowy mountains").

Does the whole job:
  - generates all 42 grammar fields per object (core 17 + 25 extended)
  - drops tile-seam duplicates (IoU > 0.55)
  - renumbers ids
  - writes the page into BOTH the inline spatialIndex in index.html AND
    spatial_index.json, which must stay in step
  - renders a verification PNG of the boxes over the artwork

The viewer reads the INLINE copy in index.html. spatial_index.json alone does
nothing — updating only that file was a real bug once. Always run this script
rather than editing either file by hand.
"""
import json, sys, os, importlib.util

HERE = os.path.dirname(os.path.abspath(__file__))
BP   = os.path.dirname(HERE)
sys.path.insert(0, HERE)

from grammar_core import build as build_core          # noqa: E402
from grammar_extra import build_extra                 # noqa: E402


def load_page_data(path):
    spec = importlib.util.spec_from_file_location("page_data", path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod.P


def iou(a, b):
    ay0, ax0, ay1, ax1 = a
    by0, bx0, by1, bx1 = b
    ix = max(0, min(ax1, bx1) - max(ax0, bx0))
    iy = max(0, min(ay1, by1) - max(ay0, by0))
    inter = ix * iy
    union = (ax1-ax0)*(ay1-ay0) + (bx1-bx0)*(by1-by0) - inter
    return inter/union if union else 0


def build_objects(page, rows):
    objs = []
    for name, box, subj, verb, rest, plural in rows:
        g = build_core(subj, verb, rest, plural)
        g.update(build_extra(g))
        g['present_progressive'] = "%s %s %s." % (subj, 'are' if plural else 'is', g['present_continuous'])
        objs.append({'id': '', 'name': name,
                     'box': [round(float(v), 1) for v in box],
                     'grammar_data': g})
    # drop tile-seam duplicates, keeping the first
    drop = set()
    for i in range(len(objs)):
        for j in range(i+1, len(objs)):
            if j not in drop and iou(objs[i]['box'], objs[j]['box']) > 0.55:
                drop.add(j)
    objs = [o for k, o in enumerate(objs) if k not in drop]
    for n, o in enumerate(objs, 1):
        o['id'] = 'p%d_obj_%d' % (page, n)
    return objs, len(drop)


def write_page(page, objs):
    html = os.path.join(BP, 'index.html')
    s = open(html).read()
    i = s.index('var spatialIndex = ') + len('var spatialIndex = ')
    j = s.index('};', i) + 1
    idx = json.loads(s[i:j])
    idx['wimmelbook_%d' % page] = objs
    s = s[:i] + json.dumps(idx, ensure_ascii=False, separators=(',', ':')) + s[j:]
    open(html, 'w').write(s)

    with open(os.path.join(BP, 'spatial_index.json'), 'w') as f:
        json.dump(idx, f, ensure_ascii=False, indent=2)
        f.write('\n')
    return idx


def render_check(page, objs):
    try:
        from PIL import Image, ImageDraw
    except ImportError:
        return None
    src = os.path.join(BP, 'wimmelbook_%d.jpg' % page)
    im = Image.open(src).convert('RGB')
    W, H = im.size
    im = im.resize((W*2, H*2), Image.LANCZOS)
    W, H = im.size
    dr = ImageDraw.Draw(im)
    for o in objs:
        y0, x0, y1, x1 = o['box']
        dr.rectangle([x0/100*W, y0/100*H, x1/100*W, y1/100*H], outline=(255, 40, 0), width=2)
    out = os.path.join(BP, 'tools', 'check_page%d.png' % page)
    im.save(out)
    return out


def main():
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)
    page = int(sys.argv[1])
    rows = load_page_data(sys.argv[2])
    objs, dropped = build_objects(page, rows)
    idx = write_page(page, objs)
    png = render_check(page, objs)
    print("page %d: %d objects written (%d seam duplicates dropped)" % (page, len(objs), dropped))
    print("grammar fields per object: %d" % len(objs[0]['grammar_data']))
    print("index total: %d objects across %d pages" % (sum(len(v) for v in idx.values()), len(idx)))
    if png:
        print("verification render: %s  <-- LOOK AT THIS before committing" % png)


if __name__ == '__main__':
    main()
