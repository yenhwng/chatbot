from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
import asyncio
from typing import List

app = FastAPI()

# Load model 1 lần khi start server
model = SentenceTransformer(
    "alibaba-NLP/gte-multilingual-base",
    trust_remote_code=True
)

# Queue để quản lý request embedding
queue = asyncio.Queue()
MAX_CONCURRENT_TASKS = 4  # số request cùng lúc

class EmbedRequest(BaseModel):
    text: str

class EmbedResponse(BaseModel):
    embedding: List[float]

# Worker xử lý queue
async def worker():
    while True:
        req, fut = await queue.get()
        try:
            emb = model.encode(req.text, normalize_embeddings=True)
            fut.set_result(emb.tolist())
        except Exception as e:
            fut.set_exception(e)
        finally:
            queue.task_done()

# Khởi động các worker
for _ in range(MAX_CONCURRENT_TASKS):
    asyncio.create_task(worker())

@app.post("/embed", response_model=EmbedResponse)
async def embed(req: EmbedRequest):
    loop = asyncio.get_event_loop()
    fut = loop.create_future()
    await queue.put((req, fut))
    embedding = await fut
    return {"embedding": embedding}
