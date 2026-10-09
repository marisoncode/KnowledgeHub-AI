from app.services.embedding_service import generate_embeddings
from app.services.vector_service import create_collection, store_embeddings


chunks = [
    "FastAPI is a Python web framework.",
    "PostgreSQL is a relational database.",
    "RAG retrieves relevant information before generating an answer.",
    "FastAPI is Marisons Friend"
]


create_collection()

embeddings = generate_embeddings(chunks)

print("Chunks:", len(chunks))
print("Embeddings:", len(embeddings))

store_embeddings(
    chunks=chunks,
    embeddings=embeddings,
    filename="test_document.pdf"
)

print("Embeddings stored successfully!")