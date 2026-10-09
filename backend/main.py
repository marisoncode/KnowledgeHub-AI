import httpx
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.documents import router as documents_router

app = FastAPI(title="KnowledgeHub AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(documents_router)


@app.get("/")
def root():
    return {"message": "KnowledgeHub AI Backend is running"}


@app.get("/ai-health")
async def ai_health():
    async with httpx.AsyncClient() as client:
        response = await client.get("http://127.0.0.1:8001/health")

    return {
        "ai_service": response.json()
    }