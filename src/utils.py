import requests
from bs4 import BeautifulSoup
from transformers import pipeline

def fetch_latest_articles(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    articles = soup.find_all('article')
    return [{'title': a.find('h2').text, 'url': a.find('a')['href']} for a in articles[:5]]

def summarize_text(text):
    summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
    summary = summarizer(text, max_length=100, min_length=30, do_sample=False)
    return summary[0]['summary_text']

def query_gaianet(prompt):
    response = requests.post(f"{GAIANET_NODE_URL}/v1/chat/completions", json={
        "messages": [{"role": "user", "content": prompt}]
    })
    return response.json()['choices'][0]['message']['content']