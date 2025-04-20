/**
 * Main server file for Amazon product scraper API
 * Uses Express to create a server and expose endpoints
 */
import express from 'express';
import cors from 'cors';
import { scrapeAmazonProducts } from './scraper.js';

// Initialize Express application
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Main scraping endpoint
app.get('/api/scrape', async (req, res) => {
  try {
    const { keyword } = req.query;
    
    // Validate keyword parameter
    if (!keyword) {
      return res.status(400).json({ 
        error: 'Missing required parameter: keyword' 
      });
    }

    console.log(`Scraping Amazon for keyword: ${keyword}`);
    
    // Call scraper function
    const products = await scrapeAmazonProducts(keyword);
    
    // Return results
    res.status(200).json({
      success: true,
      keyword,
      count: products.length,
      products
    });
  } catch (error) {
    console.error('Scraping error:', error.message);
    
    // Return error response
    res.status(500).json({
      success: false,
      error: 'Failed to scrape products',
      message: error.message
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Endpoints available:`);
  console.log(`- GET /api/health: Health check`);
  console.log(`- GET /api/scrape?keyword=yourKeyword: Scrape Amazon products`);
});