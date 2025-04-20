# Amazon Product Scraper

A simple web application that scrapes Amazon product listings from search results. This project consists of a backend API built with Bun and a frontend interface built with HTML, CSS, and JavaScript.

## Project Architecture

The project follows a client-server architecture with clear separation of concerns:

```
amazon-scraper/
├── backend/                  # Server-side code
│   ├── package.json         # Backend dependencies
│   ├── index.js             # Express server setup
│   └── scraper.js           # Amazon scraping logic
├── frontend/                 # Client-side code
│   ├── package.json         # Frontend dependencies
│   ├── index.html           # Main HTML structure
│   ├── src/                 # Source files
│   │   ├── main.js          # Frontend JavaScript logic
│   │   └── style.css        # CSS styles
│   └── vite.config.js       # Vite configuration
└── README.md                # Project documentation
```

### Software Architecture

1. **Backend (API)**
   - Built with Bun + Express.js
   - Follows a modular design with separate scraper module
   - Provides RESTful endpoints
   - Handles error cases gracefully
   - Uses Axios for HTTP requests and JSDOM for HTML parsing

2. **Frontend (UI)**
   - Built with vanilla HTML, CSS, JavaScript
   - Uses Vite for development and building
   - Follows component-based design using HTML templates
   - Implements responsive design with CSS Grid and Flexbox
   - Handles loading states, errors, and results display

3. **Communication**
   - Uses RESTful API endpoints
   - Data exchanged in JSON format
   - Frontend proxies API requests through Vite dev server

## Requirements

- [Bun](https://bun.sh/) (>=1.0.0)
- Modern web browser

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/amazon-product-scraper.git
   cd amazon-product-scraper
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   bun install
   ```

3. Install frontend dependencies:
   ```bash
   cd ../frontend
   bun install
   ```

## Running the Application

### Backend

1. Start the backend server:
   ```bash
   cd backend
   bun run dev
   ```

2. The server will run on `http://localhost:3000` with the following endpoints:
   - GET `/api/health` - Check if the API is running
   - GET `/api/scrape?keyword=yourKeyword` - Scrape Amazon products

### Frontend

1. In a new terminal, start the frontend development server:
   ```bash
   cd frontend
   bun run dev
   ```

2. The frontend will be available at `http://localhost:5173`

## Usage

1. Enter a search keyword in the input field (e.g., "headphones", "laptop")
2. Click the "Search" button or press Enter
3. Wait for the results to load
4. View the scraped product listings with:
   - Product title
   - Product image
   - Star rating
   - Number of reviews
   - Price
   - Link to the product page

## Features

- Clean, responsive user interface
- Real-time scraping of Amazon product listings
- Error handling and loading states
- Example keyword suggestions
- Star rating visualization
- Proper error handling for failed requests
- Product cards with hover effects

## Limitations

- This scraper is for educational purposes only
- Amazon's website structure may change, requiring updates to the scraping logic
- Amazon may block repeated requests from the same IP address
- The scraper only retrieves products from the first page of results

## Future Improvements

- Add pagination to retrieve more than one page of results
- Implement filtering and sorting options
- Add caching to reduce duplicate requests
- Implement rate limiting to avoid being blocked by Amazon
- Add more detailed product information
- Implement user authentication and saved searches

## License

This project is for educational purposes only. Use responsibly and respect Amazon's terms of service.

---

**Disclaimer:** This tool is built for educational purposes only. The developers are not responsible for any misuse or violation of Amazon's terms of service. Always check and respect the website's robots.txt file and terms of service before scraping any website.