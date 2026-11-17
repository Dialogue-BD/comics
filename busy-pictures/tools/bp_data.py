"""Shared data I/O for the Busy Pictures viewer.

``spatial_index.json`` is the single source of truth for every picture's
objects, boxes and sentences. The viewer does NOT read it directly: it is far
too large (26 MB) for students' phones. Instead the viewer loads one small
file per picture from ``data/`` when that picture opens.

Every tool that changes the data should end with::

    import bp_data
    bp_data.save_index(index)        # writes spatial_index.json + data/*.js

or, if it already wrote spatial_index.json itself::

    bp_data.write_viewer_data(index)

``python3 tools/bp_data.py`` rebuilds ``data/`` from spatial_index.json at any
time (safe to rerun).

What goes into a picture file
-----------------------------
Only what the viewer reads: id, name, box, and the 21 live sentences per
object (seven ``main_*`` tenses, each affirmative / negative / question).
The older grammar fields stay in spatial_index.json for the authoring tools
but never reach the phone.

Cache busting
-------------
``index.html`` carries ``var BUSY_DATA_VERSION = "<hash>";``. It is rewritten
here from a hash of the data files, so phones fetch fresh files after a data
change and keep cached files otherwise.
"""

import hashlib
import json
import os
import re
import sys

BP = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JSON_PATH = os.path.join(BP, "spatial_index.json")
HTML_PATH = os.path.join(BP, "index.html")
DATA_DIR = os.path.join(BP, "data")

VERSION_RE = re.compile(r'var BUSY_DATA_VERSION = "[^"]*";')


def is_live_field(key):
    return key.startswith("main_")


def load_index():
    with open(JSON_PATH, encoding="utf-8") as f:
        return json.load(f)


def slim_page(objects):
    out = []
    for obj in objects:
        grammar = obj.get("grammar_data") or {}
        out.append({
            "id": obj["id"],
            "name": obj["name"],
            "box": obj["box"],
            "grammar_data": {k: v for k, v in grammar.items() if is_live_field(k)},
        })
    return out


def page_script(page_key, objects):
    body = json.dumps(slim_page(objects), ensure_ascii=False, separators=(",", ":"))
    return "busyPicturesPageData(%s,%s);\n" % (json.dumps(page_key), body)


def write_viewer_data(index, quiet=False):
    """Write data/<page>.js for every picture and refresh the version stamp."""
    os.makedirs(DATA_DIR, exist_ok=True)
    digest = hashlib.sha1()
    written = 0
    for page_key in sorted(index, key=lambda k: int(k.rsplit("_", 1)[1])):
        text = page_script(page_key, index[page_key])
        digest.update(text.encode("utf-8"))
        path = os.path.join(DATA_DIR, page_key + ".js")
        old = None
        if os.path.exists(path):
            with open(path, encoding="utf-8") as f:
                old = f.read()
        if old != text:
            with open(path, "w", encoding="utf-8") as f:
                f.write(text)
            written += 1
    version = digest.hexdigest()[:10]

    with open(HTML_PATH, encoding="utf-8") as f:
        html = f.read()
    if not VERSION_RE.search(html):
        raise SystemExit("index.html has no BUSY_DATA_VERSION line; cannot stamp the data version.")
    html2 = VERSION_RE.sub('var BUSY_DATA_VERSION = "%s";' % version, html, count=1)
    if html2 != html:
        with open(HTML_PATH, "w", encoding="utf-8") as f:
            f.write(html2)
    if not quiet:
        print("viewer data: %d picture files, %d changed, version %s" % (len(index), written, version))
    return version


def save_index(index):
    """Write spatial_index.json and the per-picture viewer files."""
    with open(JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(index, f, ensure_ascii=False, indent=2)
        f.write("\n")
    return write_viewer_data(index)


if __name__ == "__main__":
    if len(sys.argv) > 1:
        raise SystemExit(__doc__)
    write_viewer_data(load_index())
