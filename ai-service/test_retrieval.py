from app.services.embedding_service import generate_embeddings
from app.services.vector_service import search_similar_chunks


question = "What is FastAPI?"

query_embedding = generate_embeddings([question])[0]

results = search_similar_chunks(query_embedding, limit=4)

print(f"Found {len(results)} results:\n")

for result in results:
    print("Score:", result.score)
    print("Text:", result.payload["text"])
    print("Filename:", result.payload["filename"])
    print("Chunk:", result.payload["chunk_index"])
    print("-" * 50)