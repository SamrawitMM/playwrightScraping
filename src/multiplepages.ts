/**
 * Playwright Web Scraper for E-commerce Site
 * This script uses Playwright to scrape product information from an e-commerce website. 
 * It initializes a Chromium browser, navigates to the specified site, and extracts product 
 * names and prices from each page. The script continuously paginates through the site until
 * no more pages are available. Each product's details are logged to the console. 
 * The browser is closed once the scraping process is complete.
 * 
 *  */

 const { chromium } = require('playwright');

 (async () => {
     // Initialize the Chromium browser and create a new page
     const browser = await chromium.launch({ timeout: 60000 });
     const context = await browser.newContext();
     const page = await context.newPage();
     
     // Open the target e-commerce website
     await page.goto('https://www.scrapingcourse.com/ecommerce/', { timeout: 900000 });
 
     // Function to extract and log product details
     async function fetchProductDetails() {
         // Get all product links on the current page
         const productElements = await page.$$('.woocommerce-LoopProduct-link');
 
         // Loop through each product element
         for (const product of productElements) {
             try {
                 // Extract product name and price
                 const name = await product.$eval('.woocommerce-loop-product__title', (el:HTMLElement) => el.innerText);
                 const cost = await product.$eval('.price', (el:HTMLElement) => el.innerText);
 
                 // Log the extracted details
                 console.log(`Product Name: ${name}`);
                 console.log(`Product Price: ${cost}`);
             } catch (error) {
                 console.error('Error extracting product details:', error);
             }
         }
     }
 
     // Scrape multiple pages if available
     while (true) {
         try {
             // Retrieve product details from the current page
             await fetchProductDetails();
 
             // Check for the existence of the next page button and navigate if found
             const nextPage = await page.$('.next.page-numbers');
             if (nextPage) {
                 await nextPage.click({ timeout: 100000 });
                 await page.waitForTimeout(30000); // Wait for the next page to load
             } else {
                 console.log('No additional pages found.');
                 break;
             }
         } catch (error) {
             console.error('An error occurred during pagination:', error);
             break;
         }
     }
     
     // Close the browser once scraping is complete
     await browser.close();
 })();
 