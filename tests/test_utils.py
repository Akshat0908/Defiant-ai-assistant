import pytest
from src.utils import summarize_text, fetch_latest_articles
from src.config import DEFIANT_URL

def test_summarize_text():
    text = "This is a long article about web3 and DeFi. It contains many details about blockchain technology and decentralized finance."
    summary = summarize_text(text)
    assert len(summary) < len(text)
    assert "web3" in summary.lower() or "defi" in summary.lower()

def test_fetch_latest_articles():
    articles = fetch_latest_articles(DEFIANT_URL)
    assert len(articles) > 0
    assert all(["title" in article and "url" in article for article in articles])