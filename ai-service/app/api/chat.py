from fastapi import APIRouter

from app.services.embedding_service import generate_embeddings
from app.services.vector_service import search_similar_chunks
from app.services.llm_service import generate_answer


router = APIRouter(
    prefix="/chat",
    tags=["Chat"]
)


@router.post("/ask")
async def ask_question(
    document_id: int,
    question: str
):
    # 1. Convert question into embedding
    query_embedding = generate_embeddings([question])[0]

    # 2. Search ONLY inside this document
    results = search_similar_chunks(
        query_embedding=query_embedding,
        document_id=document_id,
        limit=3
    )

    if not results:
        return {
            "document_id": document_id,
            "question": question,
            "answer": "I don't have enough information in the provided document.",
            "sources": []
        }

    # 3. Build context
    context = "\n\n".join(
        result.payload["text"]
        for result in results
    )

    # 4. Generate answer using retrieved context
    answer = generate_answer(
        question=question,
        context=context
    )

    # 5. Return sources
    sources = [
    {
        "filename": result.payload["filename"],
        "page": result.payload["page"],
        "chunk": result.payload["chunk_index"],
        "score": result.score
    }
    for result in results
]

    return {
        "document_id": document_id,
        "question": question,
        "answer": answer,
        "sources": sources
    }