"""Render unchanged original PDF pages for the browser; requires PyMuPDF/Pillow."""
from pathlib import Path
import fitz
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
(ROOT/'assets').mkdir(exist_ok=True)
with fitz.open(ROOT/'kindness_repentence.pdf') as doc:
 for number,page in enumerate(doc,1):
  scale=1600/page.rect.height
  pix=page.get_pixmap(matrix=fitz.Matrix(scale,scale),alpha=False)
  image=Image.frombytes('RGB',[pix.width,pix.height],pix.samples)
  image.save(ROOT/f'assets/page-{number}.jpg',quality=94)
  image.save(ROOT/f'assets/page-{number}.webp',quality=90,method=6)
print('Rendered all eight original pages without altering the PDF.')
