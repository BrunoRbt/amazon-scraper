/**
 * Amazon product scraper module
 * Uses Axios to fetch HTML content and JSDOM to parse it
 */
import axios from 'axios';
import { JSDOM } from 'jsdom';

// User agent to mimic a browser request
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

/**
 * Scrapes Amazon search results for a given keyword
 * @param {string} keyword - The search term to look for on Amazon
 * @returns {Promise<Array>} - Array of product objects
 */
export async function scrapeAmazonProducts(keyword) {
  try {
    // Format the keyword for URL
    const encodedKeyword = encodeURIComponent(keyword);
    const url = `https://www.amazon.com/s?k=${encodedKeyword}`;
    
    console.log(`Fetching URL: ${url}`);
    
    // Make HTTP request to Amazon
    const response = await axios.get(url, {
      headers: {
        'User-Agent': USER_AGENT,
        'Accept': 'text/html,application/xhtml+xml,application/xml',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      timeout: 10000 // 10 second timeout
    });
    
    // Check if request was successful
    if (response.status !== 200) {
      throw new Error(`Failed to fetch Amazon page: ${response.status}`);
    }
    
    // Parse HTML with JSDOM
    const dom = new JSDOM(response.data);
    const document = dom.window.document;
    
    // Get all product cards
    // Amazon's structure can change, so we need to handle multiple possible selectors
    const productCards = document.querySelectorAll('div[data-component-type="s-search-result"]');
    
    console.log(`Found ${productCards.length} product cards`);
    
    // Extract data from each product card
    const products = [];
    
    productCards.forEach((card, index) => {
      try {
        // Extract product title
        const titleElement = card.querySelector('h2 a span') || card.querySelector('h2 a');
        const title = titleElement ? titleElement.textContent.trim() : 'Title not found';
        
        // Extract product URL
        const linkElement = card.querySelector('h2 a');
        const relativeUrl = linkElement ? linkElement.getAttribute('href') : '';
        const productUrl = relativeUrl ? `https://www.amazon.com${relativeUrl}` : '';
        
        // Extract rating
        const ratingElement = card.querySelector('span[aria-label*="stars"]') || 
                             card.querySelector('i[class*="a-icon-star"]');
        let rating = 'No rating';
        
        if (ratingElement) {
          const ratingText = ratingElement.getAttribute('aria-label') || ratingElement.textContent;
          // Extract rating value using regex (looking for patterns like "4.5 out of 5 stars")
          const ratingMatch = ratingText.match(/([0-9.]+)/);
          rating = ratingMatch ? parseFloat(ratingMatch[1]) : 'No rating';
        }
        
        // Extract number of reviews
        const reviewCountElement = card.querySelector('span[aria-label*="stars"] + span') || 
                                  card.querySelector('a[href*="customerReviews"]');
        let reviewCount = 'No reviews';
        
        if (reviewCountElement) {
          const reviewText = reviewCountElement.textContent.trim();
          // Extract numbers from text
          const reviewMatch = reviewText.match(/([0-9,]+)/);
          reviewCount = reviewMatch ? reviewMatch[1].replace(/,/g, '') : 'No reviews';
          reviewCount = isNaN(parseInt(reviewCount)) ? 'No reviews' : parseInt(reviewCount);
        }
        
        // Extract image URL
        const imageElement = card.querySelector('img[data-image-latency="s-product-image"]') || 
                            card.querySelector('img[class*="s-image"]');
        const imageUrl = imageElement ? imageElement.getAttribute('src') : '';
        
        // Extract price
        const priceElement = card.querySelector('span.a-price span.a-offscreen') || 
                            card.querySelector('span.a-price');
        let price = 'Price not available';
        
        if (priceElement) {
          price = priceElement.textContent.trim();
        }
        
        // Add product to results array
        products.push({
          title,
          rating,
          reviewCount,
          imageUrl,
          price,
          productUrl,
          position: index + 1
        });
      } catch (error) {
        console.error(`Error extracting data from product card #${index + 1}:`, error.message);
      }
    });
    
    return products;
  } catch (error) {
    console.error('Scraping error:', error);
    throw new Error(`Scraping failed: ${error.message}`);
  }
}