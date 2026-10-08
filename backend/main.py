from fastapi import FastAPI

app = FastAPI(title="KnowledgeHub AI Backend")


@app.get("/")
def root():
    return {"message": "KnowledgeHub AI Backend is running"}
