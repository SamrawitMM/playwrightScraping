/**
 * Playwright test that takes a screenshot and generates a PDF of a webpage, and then compares 
 * the screenshot to a saved snapshot.
 * 
 */

import { test, expect, chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test('screenshot and PDF generation', async () => {
   const timeout = 60000; 
   test.setTimeout(timeout);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto('https://example.com');

  const screenshotPath = path.join(__dirname, 'example-domain.png');
  await page.screenshot({ path: screenshotPath });
  
  console.log('Screenshot taken and saved to:', screenshotPath);

  const pdfPath = path.join(__dirname, 'example.pdf');
  await page.pdf({ path: pdfPath, format: 'A4' });

  console.log('PDF generated and saved to:', pdfPath);

  // Compare screenshots using toMatchSnapshot
  await expect(await page.screenshot()).toMatchSnapshot('example-domain.png');

  await browser.close();
});
