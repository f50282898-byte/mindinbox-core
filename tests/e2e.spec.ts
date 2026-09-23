import { test, expect } from '@playwright/test';

test.describe('Mind in a Box - Elite E2E Validation', () => {
  test('User successfully logs in, bypasses paywall, and receives AI analysis', async ({ page }) => {
    // 1. Navigate to the application
    await page.goto('http://localhost:3000/auth');

    // 2. Perform Login (Assuming a mock or bypass exists for E2E, or using Google Auth)
    await page.fill('input[type="email"]', 'test@mindinbox.com');
    await page.fill('input[type="password"]', 'ElitePassword123!');
    await page.click('button:has-text("تسجيل الدخول")');

    // 3. Verify successful redirection and Dev Mode bypass
    await page.waitForURL('**/dashboard/tracker');
    
    // Assert Dev Mode badge is visible (from Gatekeeper layout bypass)
    await expect(page.locator('text=Dev Mode: Premium Unlocked')).toBeVisible();

    // 4. Interact with the Mind\'s Mirror (AI Prompt)
    // Adjust the placeholder selector based on the exact UI implementation
    const promptInput = page.locator('textarea');
    await expect(promptInput).toBeVisible();
    await promptInput.fill('أشعر بالضغط المستمر وأنني أركض في سباق لا ينتهي.');

    // Click the analysis button
    const analyzeButton = page.locator('button:has-text("تحليل")');
    await analyzeButton.click();

    // 5. Assert the AI Response renders successfully
    // Wait for the response container to appear and contain Arabic text
    await page.waitForSelector('.prose', { timeout: 20000 }); // Wait up to 20s for Gemini response
    const responseText = await page.locator('.prose').textContent();
    
    // Verify it contains a substantial philosophical response
    expect(responseText?.length).toBeGreaterThan(50);
  });
});

