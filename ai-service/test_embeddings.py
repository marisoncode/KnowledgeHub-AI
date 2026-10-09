from app.services.embedding_service import generate_embeddings


chunks = [
    "FastAPI is a Python web framework.",
    "PostgreSQL is a relational database.",
    "RAG retrieves relevant information before generating an answer."
]

embeddings = generate_embeddings(chunks)

print("Number of embeddings:", len(embeddings))
print("Embedding dimensions:", len(embeddings[0]))
print("First embedding:", embeddings[0][:5])