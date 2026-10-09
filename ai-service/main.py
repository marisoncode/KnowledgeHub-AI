from fastapi import FastAPI

from app.api.documents import router as documents_router
from app.api.chat import router as chat_router


app = FastAPI(title="KnowledgeHub AI Service")

app.include_router(documents_router)
app.include_router(chat_router)


@app.get("/")
def root():
    return {"message": "KnowledgeHub AI Service is running"}


@app.get("/health")
def health():
    return {"status": "healthy"}