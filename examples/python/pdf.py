from pathlib import Path
from monocr_onnx import read_pdf

project_root = Path(__file__).resolve().parent.parent.parent
pdf_path = project_root / "data/pdfs/Mon_E_library.pdf"

print(f"Reading PDF: {pdf_path}")
try:
    pages = read_pdf(pdf_path)
    for i, text in enumerate(pages):
        print(f"--- Page {i+1} ---")
        print(text)
        print()
except Exception as e:
    print(f"Error: {e}")
