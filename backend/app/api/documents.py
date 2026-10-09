from pathlib import Path
from typing import List, Optional
import httpx
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import SessionLocal
from app.models.document import Document

router = APIRouter(
    prefix="/documents",
    tags=["Documents"]
)

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

AI_SERVICE_URL = "http://127.0.0.1:8001"


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class DocumentResponse(BaseModel):
    id: int
    filename: str
    file_path: str
    file_type: str
    status: str

    class Config:
        from_attributes = True


class ChatRequest(BaseModel):
    document_id: int
    question: str


@router.post("/upload", response_model=DocumentResponse)
async def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="Filename is required"
        )
    
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are currently supported"
        )

    file_path = UPLOAD_DIR / file.filename

    # Save file locally
    contents = await file.read()
    with file_path.open("wb") as buffer:
        buffer.write(contents)

    # Create DB record with status 'processing'
    doc = Document(
        filename=file.filename,
        file_path=str(file_path),
        file_type=file.content_type or "application/pdf",
        status="processing"
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)

    # Forward file to AI service for ingestion/chunking/embedding
    try:
        async with httpx.AsyncClient(timeout=120.0) as client:
            # Re-send the file content to AI service process endpoint
            files = {"file": (file.filename, contents, file.content_type or "application/pdf")}
            response = await client.post(
                f"{AI_SERVICE_URL}/documents/process",
                params={"document_id": doc.id},
                files=files
            )
            
            if response.status_code == 200:
                doc.status = "completed"
            else:
                doc.status = "failed"
            db.commit()
            db.refresh(doc)
    except Exception as e:
        doc.status = "failed"
        db.commit()
        db.refresh(doc)
        raise HTTPException(
            status_code=500,
            detail=f"Uploaded to backend, but AI service processing failed: {str(e)}"
        )

    return doc


@router.get("", response_model=List[DocumentResponse])
@router.get("/", response_model=List[DocumentResponse])
def get_documents(db: Session = Depends(get_db)):
    documents = db.query(Document).order_by(Document.id.desc()).all()
    return documents


@router.post("/chat/ask")
async def chat_ask(req: ChatRequest):
    if not req.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                f"{AI_SERVICE_URL}/chat/ask",
                params={"document_id": req.document_id, "question": req.question}
            )
            if response.status_code != 200:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=response.text or "Error from AI Service"
                )
            return response.json()
    except httpx.RequestError as exc:
        raise HTTPException(
            status_code=503,
            detail=f"AI Service unavailable: {str(exc)}"
        )