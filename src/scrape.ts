/**
 * This script uses Playwright to scrape temperature data from the Weather.com website. 
 * It launches a Chromium browser, navigates to the weather site, searches for the specified city, 
 * and extracts temperature values from the search results. The script then logs these values and 
 * takes a screenshot of the weather information for the city. Finally, it closes the browser.
 * 
 */

import { chromium } from 'playwright';

async function scrapeWeather(city: string) {
    const browser = await chromium.launch({ headless: false }); 
    const page = await browser.newPage();

    await page.goto('https://weather.com/en-IN/', { timeout: 180000 });

    await page.fill('input[data-testid="searchModalInputBox"]', city, { timeout: 180000 });

    await page.waitForSelector('input[data-testid="searchModalInputBox"]', { timeout: 180000 });
    await page.getByRole('option', { name: `${city}` }).click();

    await page.waitForSelector('ul[data-testid="WeatherTable"]', { timeout: 180000 });

    // Extract temperature values
    const temperatureValues = await page.evaluate(() => {
        const temps: string[] = [];
        const tempElements = document.querySelectorAll('ul[data-testid="WeatherTable"] span[data-testid="TemperatureValue"]');

        tempElements.forEach(el => {
            const element = el as HTMLElement; // Cast to HTMLElement
            temps.push(element.innerText.trim());
        });

        return temps;
    });

    // Log the extracted values
    console.log('Temperature Values:', temperatureValues);

    await page.screenshot({ path: `weather_${city}.png`, fullPage: true  });

    await browser.close();
}

// Call the function with the desired city
scrapeWeather('New York City');


