#!/usr/bin/env python3
from __future__ import annotations

import argparse

from card_common import CardSpecError
from font_config import font_report, resolve_card_fonts


def main() -> int:
    parser = argparse.ArgumentParser(description="Check the fonts used by Picture This! card rendering.")
    parser.add_argument(
        "--allow-fallback-fonts",
        action="store_true",
        help="Report bundled substitutes instead of failing when licensed Officina fonts are unavailable.",
    )
    args = parser.parse_args()
    fonts, fallbacks = resolve_card_fonts(allow_fallback=args.allow_fallback_fonts)
    print(font_report(fonts, fallbacks))
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except CardSpecError as error:
        raise SystemExit(f"ERROR:\n{error}")
