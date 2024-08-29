/**
 * Playwright test to automate the process of uploading multiple images to ImgBB
 * and verifying the upload process by taking a screenshot after the upload is initiated.
 * 
 * Steps:
 * 1. Navigate to the ImgBB website.
 * 2. Click on the 'Upload' button to initiate the file upload process.
 * 3. Select the appropriate file input element for uploading images.
 * 4. Upload two images by specifying their file paths.
 * 5. Click the 'Upload' button to start the upload process.
 * 6. Capture a screenshot of the page after initiating the upload.
 */

import { test, expect } from '@playwright/test';
import path from 'path';

test('test', async ({ page }) => {
    await page.goto('https://imgbb.com/');
    await page.locator('#top-bar').getByText('Upload').click();
    await page.locator('div > .icon').first().click();
    const filePath1 = path.resolve(__dirname, 'uploadtest.png');
    const filePath2 = path.resolve(__dirname, 'uploadtest2.png');

    const fileInputSelector = 'input[type="file"]#anywhere-upload-input'; 
    const fileInput = page.locator(fileInputSelector);
    // Upload the images
    await fileInput.setInputFiles([filePath1,filePath2]);

    await page.getByRole('button', { name: 'Upload' }).click();
    await page.screenshot({ path: 'upload-second-image.png' });

  });