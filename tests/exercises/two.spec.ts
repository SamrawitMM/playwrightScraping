/**
 * Playwright test that verifies title on the original page, interacts with a new tab, 
 * and then switches back to the original tab.
 * 
 */

import { test, expect } from '@playwright/test';

test('multi-page interaction', async ({ page }) => {
  const timeout = 60000; 
  test.setTimeout(timeout);

  await page.goto('https://example.com');
  
  await expect(page).toHaveTitle("Example Domain");
  
  const [newPage] = await Promise.all([
    page.context().waitForEvent('page'), // Wait for the new page event
    page.evaluate(() => window.open('https://playwright.dev')) // Open a new tab
  ]);

  await expect(newPage).toHaveTitle('Fast and reliable end-to-end testing for modern web apps | Playwright');

  await newPage.click('text=Get Started');

  // Switch back to the original tab
  await page.bringToFront();

  // Perform an action or verification in the original tab
  await expect(page).toHaveTitle("Example Domain");

  await newPage.close();
});
