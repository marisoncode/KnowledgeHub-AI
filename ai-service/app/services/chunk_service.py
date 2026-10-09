def chunk_pages(
    pages: list[dict],
    chunk_size: int = 1000,
    overlap: int = 200
) -> list[dict]:

    chunks = []

    for page in pages:
        text = page["text"]
        page_number = page["page"]

        start = 0

        while start < len(text):
            end = start + chunk_size

            chunk = text[start:end]

            if chunk.strip():
                chunks.append({
                    "text": chunk.strip(),
                    "page": page_number
                })

            start += chunk_size - overlap

    return chunks