const express = require('express');
const axios = require('axios');
const Parser = require('rss-parser');
const cors = require('cors');
const NodeCache = require('node-cache');
require('dotenv').config();
const path = require('path');

const app = express();
const parser = new Parser();
const cache = new NodeCache({ stdTTL: 600 }); // Cache for 10 minutes

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

// Add this middleware at the top of your app.js, after other app.use() statements
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
});

const GAIANET_NODE_URL = process.env.GAIANET_NODE_URL || 'https://0xdc99b165b0cd29eac9e81c0e617dc96118f0134e.us.gaianet.network';
const DEFIANT_URL = 'https://thedefiant.io';
const SYSTEM_PROMPT = `You are a DeFi expert. Provide concise answers about recent DeFi developments.`;

const CoinGecko = require('coingecko-api');
const coinGeckoClient = new CoinGecko();

app.get('/api/news', async (req, res) => {
    try {
        const cachedNews = cache.get('news');
        if (cachedNews) {
            return res.json(cachedNews);
        }

        const feed = await parser.parseURL(`${DEFIANT_URL}/feed`);
        const articles = feed.items.slice(0, 5).map(item => ({
            title: item.title,
            url: item.link,
            summary: item.contentSnippet
        }));

        cache.set('news', articles);
        res.json(articles);
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ error: 'Failed to fetch news' });
    }
});

app.post('/api/query', async (req, res) => {
    const startTime = Date.now();
    try {
        const { query } = req.body;
        console.log('Received query:', query);

        console.log('Sending request to GaiaNet');
        const response = await axios.post(`${GAIANET_NODE_URL}/v1/chat/completions`, {
            messages: [
                { role: 'system', content: 'You are a DeFi expert. Provide concise answers about recent DeFi developments.' },
                { role: 'user', content: query }
            ]
        }, { timeout: 30000 });  // 30 second timeout

        console.log('Received response from GaiaNet');
        const aiResponse = response.data.choices[0].message.content;
        res.json({ response: aiResponse });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Failed to process query' });
    } finally {
        console.log(`Request processed in ${Date.now() - startTime}ms`);
    }
});

// New endpoint for market data
app.get('/api/market-data', async (req, res) => {
    try {
        const cachedData = cache.get('market-data');
        if (cachedData) {
            return res.json(cachedData);
        }

        const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
            params: {
                vs_currency: 'usd',
                order: 'market_cap_desc',
                per_page: 10,
                page: 1,
                sparkline: false,
                ids: 'ethereum,uniswap,aave,compound-governance-token,maker'
            }
        });

        const marketData = response.data.map(coin => ({
            id: coin.id,
            name: coin.name,
            symbol: coin.symbol,
            price: coin.current_price,
            change_24h: coin.price_change_percentage_24h
        }));

        cache.set('market-data', marketData, 300); // Cache for 5 minutes
        res.json(marketData);
    } catch (error) {
        console.error('Error fetching market data:', error.response ? error.response.data : error.message);
        console.error('Full error object:', JSON.stringify(error, null, 2));
        res.status(500).json({ 
            error: 'Failed to fetch market data', 
            details: error.message,
            response: error.response ? error.response.data : 'No response data'
        });
    }
});

// New endpoint for gas prices
app.get('/api/gas-prices', async (req, res) => {
    try {
        const cachedData = cache.get('gas-prices');
        if (cachedData) {
            return res.json(cachedData);
        }

        const response = await axios.get('https://api.etherscan.io/api', {
            params: {
                module: 'gastracker',
                action: 'gasoracle',
                apikey: process.env.ETHERSCAN_API_KEY
            }
        });

        const gasPrices = response.data.result;
        cache.set('gas-prices', gasPrices, 60); // Cache for 1 minute
        res.json(gasPrices);
    } catch (error) {
        console.error('Error fetching gas prices:', error);
        res.status(500).json({ error: 'Failed to fetch gas prices' });
    }
});

// For any other routes, serve the index.html file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Update the error handler at the bottom of app.js
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!', details: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));