import { test, expect } from '@playwright/test';

test.describe('Mind in a Box - Elite E2E Validation', () => {
  test('User successfully logs in, bypasses paywall, and receives AI analysis', async ({ page }) => {
    // 1. Navigate to the application
    await page.goto('http://localhost:3000/auth');
    // 1. Navigate to the Auth Page and ensure the DOM is loaded
    await page.goto('http://localhost:3000/auth', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle').catch(() => {});

    // 2. Perform Login (Assuming a mock or bypass exists for E2E, or using Google Auth)
    await page.fill('input[type="email"]', 'test@mindinbox.com');
    await page.fill('input[type="password"]', 'ElitePassword123!');
    await page.click('button:has-text("تسجيل الدخول")');
    // 2. Handle the "Email Login" disclosure switch if Google is the default view
    const emailToggleBtn = page.getByRole('button', { name: /المتابعة بالبريد الإلكتروني/i })
      .or(page.locator('button:has-text("المتابعة بالبريد الإلكتروني")'))
      .first();

    // 3. Verify successful redirection and Dev Mode bypass
    await page.waitForURL('**/dashboard/tracker');
    if (await emailToggleBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await emailToggleBtn.click();
    }

    // 3. Resilient Locators for Email and Password inputs
    const emailInput = page.getByPlaceholder(/البريد الإلكتروني/i)
      .or(page.locator('input[type="email"]'))
      .or(page.locator('input[placeholder*="البريد"]'))
      .first();

    await expect(emailInput).toBeVisible({ timeout: 10000 });
    await emailInput.fill('test@mindinbox.com');

    const passwordInput = page.getByPlaceholder(/كلمة المرور/i)
      .or(page.locator('input[type="password"]'))
      .or(page.locator('input[placeholder*="مرور"]'))
      .first();

    await expect(passwordInput).toBeVisible({ timeout: 10000 });
    await passwordInput.fill('ElitePassword123!');

    // 4. Click Submit Button
    const submitBtn = page.getByRole('button', { name: /تسجيل الدخول/i })
      .or(page.locator('button[type="submit"]'))
      .or(page.locator('button:has-text("تسجيل الدخول")'))
      .first();

    await expect(submitBtn).toBeVisible({ timeout: 5000 });
    await submitBtn.click();

    // 5. Verify successful navigation and Gatekeeper Dev Mode bypass
    await page.waitForURL('**/dashboard/tracker', { timeout: 15000 });
    
    // Assert Dev Mode badge is visible (from Gatekeeper layout bypass)
    await expect(page.locator('text=Dev Mode: Premium Unlocked')).toBeVisible();
    // Assert Dev Mode badge is displayed
    const devBadge = page.getByText('Dev Mode: Premium Unlocked').first();
    await expect(devBadge).toBeVisible({ timeout: 10000 });

    // 4. Interact with the Mind\'s Mirror (AI Prompt)
    // Adjust the placeholder selector based on the exact UI implementation
    const promptInput = page.locator('textarea');
    await expect(promptInput).toBeVisible();
    await promptInput.fill('أشعر بالضغط المستمر وأنني أركض في سباق لا ينتهي.');
    // 6. Interact with Mind's Mirror (Journaling & AI Prompt)
    const promptInput = page.getByPlaceholder(/بماذا يفكر عقلك/i)
      .or(page.locator('textarea'))
      .first();

    // Click the analysis button
    const analyzeButton = page.locator('button:has-text("تحليل")');
    await analyzeButton.click();
    await expect(promptInput).toBeVisible({ timeout: 10000 });
    await promptInput.fill('أشعر بالضغط المستمر وأنني أركض في سباق لا ينتهي نحو المجهول.');

    // 5. Assert the AI Response renders successfully
    // Wait for the response container to appear and contain Arabic text
    await page.waitForSelector('.prose', { timeout: 20000 }); // Wait up to 20s for Gemini response
    const responseText = await page.locator('.prose').textContent();
    
    // Verify it contains a substantial philosophical response
    expect(responseText?.length).toBeGreaterThan(50);
    // 7. Trigger AI Reflection ("تأمل أفكاري")
    const analyzeBtn = page.getByRole('button', { name: /تأمل أفكاري/i })
      .or(page.locator('button:has-text("تأمل أفكاري")'))
      .or(page.locator('button:has-text("تحليل")'))
      .first();

    await expect(analyzeBtn).toBeEnabled({ timeout: 5000 });
    await analyzeBtn.click();

    // 8. Assert AI Response is rendered inside the Oracle section
    const oracleContainer = page.locator('div:has(h2:has-text("حكمة الأوراكل"))');
    const aiResponse = oracleContainer
      .locator('p.text-neutral-300')
      .or(oracleContainer.locator('p:not(:has-text("اكتب أفكارك أولاً")):not(:has-text("يتم استدعاء الحكمة"))'))
      .first();

    await expect(aiResponse).toBeVisible({ timeout: 30000 });
    const responseText = await aiResponse.textContent();

    expect(responseText).toBeTruthy();
    expect(responseText!.trim().length).toBeGreaterThan(20);
  });
});

