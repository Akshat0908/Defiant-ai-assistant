# DeFi Insight

DeFi Insight is a comprehensive decentralized AI research assistant that provides insights, answers questions, and displays real-time data about the DeFi ecosystem.

## Features

- Fetch and display the latest DeFi news from The Defiant
- AI-powered query answering system
- Real-time market data for top DeFi tokens
- Live Ethereum gas price tracker
- Responsive design for desktop and mobile devices

## Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/defi-insight.git
   cd defi-insight
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the project root and add the following:
   ```
   GAIANET_NODE_URL=your_gaianet_node_url_here
   ETHERSCAN_API_KEY=your_etherscan_api_key_here
   ```

4. Start the server:
   ```
   npm start
   ```

5. Open `http://localhost:3000` in your browser to use the application.

## Usage

- The latest DeFi news, market data, and gas prices will be displayed automatically and refreshed every 5 minutes.
- Use the "Ask DeFi Insight" section to submit questions about DeFi.
- Explore the market overview to see current prices and 24-hour changes for top DeFi tokens.
- Check the gas prices section for current Ethereum network fees.

## License

This project is licensed under the GPL-3.0 License.