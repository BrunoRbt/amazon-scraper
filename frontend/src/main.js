/**
 * Amazon Product Scraper - Frontend Main JS
 * Manages the UI and API interactions
 */

// DOM Elements
const keywordInput = document.getElementById('keyword');
const scrapeButton = document.getElementById('scrape-button');
const exampleTags = document.querySelectorAll('.example-tag');
const loadingSection = document.getElementById('loading-section');
const errorSection = document.getElementById('error-section');
const errorMessage = document.getElementById('error-message');
const resultsSection = document.getElementById('results-section');
const keywordDisplay = document.getElementById('keyword-display');
const resultsCount = document.getElementById('results-count');
const productsContainer = document.getElementById('products-container');
const productTemplate = document.getElementById('product-template');

// API Configuration
const API_BASE_URL = '/api';
const API_ENDPOINTS = {
  SCRAPE: `${API_BASE_URL}/scrape`,
  HEALTH: `${API_BASE_URL}/health`
};

// Event Listeners
document.addEventListener('DOMContentLoaded', initApp);
scrapeButton.addEventListener('click', handleScrapeButtonClick);
keywordInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    handleScrapeButtonClick();
  }
});

exampleTags.forEach(tag => {
  tag.addEventListener('click', () => {
    keywordInput.value = tag.textContent.trim();
    handleScrapeButtonClick();
  });
});

/**
 * Initialize the application
 */
function initApp() {
  // Check if the API is available
  checkApiHealth()
    .then(isHealthy => {
      if (!isHealthy) {
        showError('API server is not available. Please make sure the backend is running.');
      }
    })
    .catch(error => {
      console.error('API Health check failed:', error);
      showError('Cannot connect to the server. Please make sure the backend is running.');
    });
  
  // Focus on the keyword input
  keywordInput.focus();
}

/**
 * Check if the API server is up and running
 * @returns {Promise<boolean>} - Whether the API is healthy
 */
async function checkApiHealth() {
  try {
    const response = await fetch(API_ENDPOINTS.HEALTH);
    if (!response.ok) {
      return false;
    }
    const data = await response.json();
    return data.status === 'ok';
  } catch (error) {
    console.error('Error checking API health:', error);
    return false;
  }
}

/**
 * Handle scrape button click
 */
function handleScrapeButtonClick() {
  const keyword = keywordInput.value.trim();
  
  if (!keyword) {
    showError('Please enter a search keyword');
    return;
  }
  
  scrapeProducts(keyword);
}

/**
 * Scrape products from Amazon for a given keyword
 * @param {string} keyword - The search keyword
 */
async function scrapeProducts(keyword) {
  // Show loading state
  showLoading();
  
  try {
    // Build URL with keyword parameter
    const url = `${API_ENDPOINTS.SCRAPE}?keyword=${encodeURIComponent(keyword)}`;
    
    // Make API request
    const response = await fetch(url);
    
    // Parse JSON response
    const data = await response.json();
    
    // Check for API errors
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to scrape products');
    }
    
    // Display results
    displayResults(data);
  } catch (error) {
    console.error('Error scraping products:', error);
    showError(error.message || 'Failed to scrape products. Please try again.');
  }
}

/**
 * Display scraped products in the UI
 * @param {Object} data - The API response data
 */
function displayResults(data) {
  // Clear previous results
  productsContainer.innerHTML = '';
  
  // Update results metadata
  keywordDisplay.textContent = `for "${data.keyword}"`;
  resultsCount.textContent = data.count;
  
  // If no products found
  if (data.products.length === 0) {
    productsContainer.innerHTML = `
      <div class="no-results">
        <p>No products found for "${data.keyword}"</p>
        <p>Try another search term</p>
      </div>
    `;
  } else {
    // Create and append product cards
    data.products.forEach(product => {
      const productCard = createProductCard(product);
      productsContainer.appendChild(productCard);
    });
  }
  
  // Show results section
  hideLoading();
  hideError();
  showResults();
  
  // Scroll to results
  resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Create a product card element from template
 * @param {Object} product - The product data
 * @returns {HTMLElement} - The product card element
 */
function createProductCard(product) {
  // Clone the template
  const template = productTemplate.content.cloneNode(true);
  
  // Set product data
  setElementContent(template, '.product-title', product.title);
  setElementAttribute(template, '.product-image img', 'src', product.imageUrl);
  setElementAttribute(template, '.product-image img', 'alt', product.title);
  setElementAttribute(template, '.view-button', 'href', product.productUrl);
  
  // Set price
  setElementContent(template, '.product-price', product.price);
  
  // Handle ratings
  const starsElement = template.querySelector('.stars');
  const reviewCountElement = template.querySelector('.review-count');
  
  if (product.rating === 'No rating') {
    starsElement.innerHTML = '';
    reviewCountElement.textContent = 'No ratings yet';
  } else {
    // Create star rating
    starsElement.innerHTML = createStarRating(product.rating);
    
    // Set review count
    if (product.reviewCount === 'No reviews') {
      reviewCountElement.textContent = '(0)';
    } else {
      reviewCountElement.textContent = `(${formatNumber(product.reviewCount)})`;
    }
  }
  
  return template;
}

/**
 * Create HTML for star rating
 * @param {number} rating - The product rating (0-5)
 * @returns {string} - HTML for star rating
 */
function createStarRating(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  
  let html = '';
  
  // Full stars
  for (let i = 0; i < fullStars; i++) {
    html += '<i class="fas fa-star"></i>';
  }
  
  // Half star
  if (halfStar) {
    html += '<i class="fas fa-star-half-alt"></i>';
  }
  
  // Empty stars
  for (let i = 0; i < emptyStars; i++) {
    html += '<i class="far fa-star"></i>';
  }
  
  return html;
}

/**
 * Format number with commas for thousands
 * @param {number} num - The number to format
 * @returns {string} - Formatted number
 */
function formatNumber(num) {
  return new Intl.NumberFormat().format(num);
}

/**
 * Set text content of an element in a template
 * @param {DocumentFragment} template - The template
 * @param {string} selector - CSS selector
 * @param {string} content - Text content
 */
function setElementContent(template, selector, content) {
  const element = template.querySelector(selector);
  if (element) {
    element.textContent = content;
  }
}

/**
 * Set attribute of an element in a template
 * @param {DocumentFragment} template - The template
 * @param {string} selector - CSS selector
 * @param {string} attribute - Attribute name
 * @param {string} value - Attribute value
 */
function setElementAttribute(template, selector, attribute, value) {
  const element = template.querySelector(selector);
  if (element) {
    element.setAttribute(attribute, value);
  }
}

// UI State Management Functions

function showLoading() {
  loadingSection.style.display = 'block';
  errorSection.style.display = 'none';
  resultsSection.style.display = 'none';
}

function hideLoading() {
  loadingSection.style.display = 'none';
}

function showError(message) {
  errorMessage.textContent = message;
  errorSection.style.display = 'block';
  loadingSection.style.display = 'none';
}

function hideError() {
  errorSection.style.display = 'none';
}

function showResults() {
  resultsSection.style.display = 'block';
}