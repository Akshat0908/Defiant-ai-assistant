from fastapi import FastAPI
from src.utils import fetch_latest_articles, summarize_text, query_gaianet
from src.config import DEFIANT_URL, SYSTEM_PROMPT

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Welcome to The Defiant AI Research Assistant"}

@app.get("/latest_news")
async def get_latest_news():
    articles = fetch_latest_articles(DEFIANT_URL)
    summaries = [summarize_text(article['title']) for article in articles]
    return [{"title": a['title'], "summary": s, "url": a['url']} for a, s in zip(articles, summaries)]

@app.post("/query")
async def query(question: str):
    context = f"{SYSTEM_PROMPT}\n\nUser question: {question}"
    response = query_gaianet(context)
    return {"answer": response}