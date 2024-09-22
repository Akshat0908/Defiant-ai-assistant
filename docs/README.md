# The Defiant AI Research Assistant

This project implements an AI research assistant for The Defiant, a leading web3 and DeFi news platform. The assistant uses GaiaNet's infrastructure to provide accurate and up-to-date information about the latest developments in the web3 and DeFi space.

## Features

- Fetch the latest articles from The Defiant's RSS feed
- Answer user queries using GaiaNet's AI model
- RESTful API for easy integration

## Setup

1. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

2. Set up a GaiaNet node following the instructions in the main README.md file.

3. Update the `GAIANET_NODE_URL` in `src/config.py` with your GaiaNet node URL.

4. Run the application:
   ```
   python -m src.api
   ```

## Usage

- GET `/`: Welcome message
- GET `/latest_news`: Fetch the latest news articles from The Defiant
- POST `/query`: Submit a question to the AI assistant

For more details, see the API documentation in `docs/API.md`.

## Testing

Run the tests using pytest:
- GET `/latest_news`: Fetch the latest news articles from The Defiant
- POST `/query`: Submit a question to the AI assistant

For more details, see the API documentation.
