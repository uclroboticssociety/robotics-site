#!/usr/bin/env python3
"""
Convert a PDF into PNG images.

Usage:
1) Set PDF_PATH to your PDF file.
2) Set OUT_DIR to the output folder.
3) Set OUT_PREFIX to the output file name prefix.
4) Run: python3 scripts/pdf_to_images.py

Requires:
- pdf2image (pip install pdf2image)
- poppler (macOS: brew install poppler)
"""

from pathlib import Path
from pdf2image import convert_from_path

# TODO: set this to your PDF path (example: "src/content/projects/VLA1/handbook.pdf")
PDF_PATH = "0.pdf"

# TODO: set this to your output folder (example: "src/content/projects/VLA1")
OUT_DIR = "pdf_pics"

# TODO: set this to your output file prefix (example: "page-")
OUT_PREFIX = ""

# Resolution (higher = larger images)
DPI = 200


def main() -> None:
    pdf_path = Path(PDF_PATH)
    out_dir = Path(OUT_DIR)
    out_dir.mkdir(parents=True, exist_ok=True)

    images = convert_from_path(str(pdf_path), dpi=DPI)
    for idx, img in enumerate(images, start=1):
        out_path = out_dir / f"{OUT_PREFIX}{idx}.png"
        img.save(out_path, "PNG")

    print(f"Done. Wrote {len(images)} images to {out_dir} with prefix '{OUT_PREFIX}'.")


if __name__ == "__main__":
    main()
