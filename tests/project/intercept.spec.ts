/**
 * Playwright Test: API Response Interception 
 *
 * This test script performs the following actions:
 * 
 * 1. Intercepts all network requests to block advertisements and modify a specific API response from the New York Times.
 * 2. Uses the Playwright `page.route()` method to fulfill the targeted API request with a modified JSON response, as specified in the `api_response.json` file.
 * 3. Logs requests and responses to the console to provide visibility into the intercepted API requests and the modified response body.
 * 4. Navigates to a specific New York Times article page.
 *
 */

import { test, expect } from '@playwright/test';
import data from './api_response.json';



test.describe('API Response Interception and Comparison', () => {
  let originalResponseBody: any;
  let modifiedResponseBody: any = data;

  let reqUrl = "https://a.nytimes.com/svc/nyt/data-layer?assetUrl=http%3A%2F%2Fwww.nytimes.com%2F2024%2F08%2F28%2Fworld%2Fasia%2Fhong-kong-stand-news-verdict.html&caller_id=nyt-vi&jkcb=1724934638110&referrer=&sourceApp=nyt-vi"

  // Base URL
  const baseUrl = 'https://a.nytimes.com/svc/nyt/data-layer';

  // Query parameters
  const queryParams = new URLSearchParams({
    assetUrl: 'http://www.nytimes.com/2024/08/28/world/asia/hong-kong-stand-news-verdict.html',
    caller_id: 'nyt-vi',
    jkcb: '1724934638110',
    referrer: '',
    sourceApp: 'nyt-vi'
  });

  // Full URL with query parameters
  const requestUrl = `${baseUrl}?${queryParams.toString()}`;

  test('Capture and compare original and intercepted API responses', async ({ page }) => {

    // Intercept all network requests to block ads and modify the targeted API response
    await page.route("**/*", async (route) => {
      const url = route.request().url();

      if (
        url.startsWith("https://securepubads.") ||
        url.startsWith("https://fastlane.") ||
        url.startsWith("https://c.amazon-adsystem.com") ||
        url.startsWith("https://aax.amazon-adsystem.com/")
      ) {
        await route.abort(); // Block ads
      } else if ((url).startsWith("https://a.nytimes.com/")) {
        // Intercept the API request and respond with the modified JSON
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(modifiedResponseBody),
        });
        
        console.log("Modified response body:", modifiedResponseBody);
      } else {
        await route.continue(); // Continue with other requests
      }
    });



    await page.goto('https://www.nytimes.com/2024/08/28/world/asia/hong-kong-stand-news-verdict.html', { timeout: 180000 });
    page.on('request', (request) => {
        console.log('Request made:', request.url());
      });
    page.on('response', async (response) => {
        console.log('Request made:', response.url());
        if (response.url().startsWith("https://a.nytimes.com/")){
            console.log("the request is made ")
            const responseUrl = response.url();
            const status = response.status();
            const headers = response.headers();
            const body =  await response.json(); 
            
            console.log('Response received:', responseUrl);
            console.log('Status:', status);
            console.log('Headers:', headers);
            console.log('Body:', body); 
          
        }
      });
 
    // Take a screenshot after the page has loaded with the modified data
    // await page.screenshot({ path: `news.png`, fullPage: true });
  });
});
