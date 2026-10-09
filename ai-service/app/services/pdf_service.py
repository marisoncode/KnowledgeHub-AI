from pypdf import PdfReader
import re


def extract_pages(file_path: str) -> list[dict]:
    reader = PdfReader(file_path)

    pages = []

    for page_number, page in enumerate(reader.pages, start=1):
        text = page.extract_text()

        if text and text.strip():
            # Clean up excessive newlines and whitespace formatting
            cleaned_text = re.sub(r'\n\s*\n', '\n', text)
            cleaned_text = re.sub(r'[ \t]+', ' ', cleaned_text).strip()

            pages.append({
                "page": page_number,
                "text": cleaned_text
            })

    return pages