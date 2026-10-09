from fastapi import APIRouter, UploadFile, File

from app.services.pdf_service import extract_pages
from app.services.chunk_service import chunk_pages
from app.services.embedding_service import generate_embeddings
from app.services.vector_service import create_collection, store_embeddings


router = APIRouter(
    prefix="/documents",
    tags=["Documents"]
)


@router.post("/process")
async def process_document(
    document_id: int,
    file: UploadFile = File(...)
):
    file_content = await file.read()

    temp_path = f"temp_{file.filename}"

    with open(temp_path, "wb") as buffer:
        buffer.write(file_content)

    # 1. Extract text page by page
    pages = extract_pages(temp_path)

    # 2. Split pages into chunks
    chunks = chunk_pages(pages)

    # 3. Extract only text for embedding
    chunk_texts = [
        chunk["text"]
        for chunk in chunks
    ]

    # 4. Generate embeddings
    embeddings = generate_embeddings(chunk_texts)

    # 5. Create Qdrant collection
    create_collection()

    # 6. Store chunks + page metadata
    store_embeddings(
        chunks=chunks,
        embeddings=embeddings,
        document_id=document_id,
        filename=file.filename
    )

    return {
        "document_id": document_id,
        "filename": file.filename,
        "page_count": len(pages),
        "chunk_count": len(chunks),
        "message": "Document processed and stored successfully"
    }