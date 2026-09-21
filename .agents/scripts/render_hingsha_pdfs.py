from pathlib import Path

import fitz


ROOT = Path(__file__).resolve().parents[2]
OUTPUT = ROOT / ".agents" / "outputs" / "hingsha-pdf-samples"
OUTPUT.mkdir(parents=True, exist_ok=True)

PDFS = {
    "vertical": ROOT / "attached_assets" / "Hingsha_Wordless_Vertical_9x16_1789978965230.pdf",
    "widescreen": ROOT / "attached_assets" / "Hingsha_Wordless_Widescreen_16x9_1789978965229.pdf",
}

for label, path in PDFS.items():
    document = fitz.open(path)
    page = document[0]
    pixmap = page.get_pixmap(matrix=fitz.Matrix(1.5, 1.5), alpha=False)
    output_path = OUTPUT / f"{label}-page-1.png"
    pixmap.save(output_path)
    print(
        f"{label}: {document.page_count} pages, "
        f"page size {page.rect.width:.1f}x{page.rect.height:.1f}, "
        f"sample {output_path}"
    )