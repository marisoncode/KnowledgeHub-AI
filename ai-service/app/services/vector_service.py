from uuid import uuid4

from qdrant_client import QdrantClient
from qdrant_client.models import (
    Distance,
    VectorParams,
    PointStruct,
    Filter,
    FieldCondition,
    MatchValue,
)


client = QdrantClient(
    host="localhost",
    port=6333
)

COLLECTION_NAME = "knowledgehub_documents"


def create_collection():
    collections = client.get_collections().collections

    existing_names = [
        collection.name
        for collection in collections
    ]

    if COLLECTION_NAME not in existing_names:
        client.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=VectorParams(
                size=384,
                distance=Distance.COSINE
            )
        )


def store_embeddings(
    chunks: list[dict],
    embeddings: list[list[float]],
    document_id: int,
    filename: str
):
    points = []

    for index, (chunk, embedding) in enumerate(
        zip(chunks, embeddings)
    ):
        points.append(
            PointStruct(
                id=str(uuid4()),
                vector=embedding,
                payload={
                    "document_id": document_id,
                    "text": chunk["text"],
                    "filename": filename,
                    "page": chunk["page"],
                    "chunk_index": index
                }
            )
        )

    client.upsert(
        collection_name=COLLECTION_NAME,
        points=points,
        wait=True
    )


def search_similar_chunks(
    query_embedding: list[float],
    document_id: int,
    limit: int = 3,
    score_threshold: float = 0.30
):
    results = client.query_points(
        collection_name=COLLECTION_NAME,
        query=query_embedding,
        query_filter=Filter(
            must=[
                FieldCondition(
                    key="document_id",
                    match=MatchValue(
                        value=document_id
                    )
                )
            ]
        ),
        limit=limit,
        score_threshold=score_threshold,
    )

    return results.points