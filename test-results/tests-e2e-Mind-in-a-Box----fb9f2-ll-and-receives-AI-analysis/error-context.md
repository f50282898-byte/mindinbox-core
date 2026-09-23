# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\e2e.spec.ts >> Mind in a Box - Elite E2E Validation >> User successfully logs in, bypasses paywall, and receives AI analysis
- Location: tests\e2e.spec.ts:4:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.goto: Test timeout of 30000ms exceeded.
Call log:
  - navigating to "http://localhost:3000/auth", waiting until "load"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - button "عربي" [ref=e2] [cursor=pointer]
  - generic [ref=e6]:
    - generic [ref=e7]:
      - heading "بوابة الدخول" [level=1] [ref=e10]
      - paragraph [ref=e11]: قم بتسجيل الدخول لبدء رحلة الوعي واستكشاف قدرات عقلك.
    - generic [ref=e12]:
      - button "المتابعة باستخدام جوجل" [ref=e13] [cursor=pointer]
      - generic [ref=e19]: أو
      - button "المتابعة بالبريد الإلكتروني" [ref=e23] [cursor=pointer]
    - link "العودة للصفحة الرئيسية" [ref=e28] [cursor=pointer]:
      - /url: /
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Mind in a Box - Elite E2E Validation', () => {
  4  |   test('User successfully logs in, bypasses paywall, and receives AI analysis', async ({ page }) => {
  5  |     // 1. Navigate to the application
> 6  |     await page.goto('http://localhost:3000/auth');
     |                ^ Error: page.goto: Test timeout of 30000ms exceeded.
  7  | 
  8  |     // 2. Perform Login (Assuming a mock or bypass exists for E2E, or using Google Auth)
  9  |     await page.fill('input[type="email"]', 'test@mindinbox.com');
  10 |     await page.fill('input[type="password"]', 'ElitePassword123!');
  11 |     await page.click('button:has-text("تسجيل الدخول")');
  12 | 
  13 |     // 3. Verify successful redirection and Dev Mode bypass
  14 |     await page.waitForURL('**/dashboard/tracker');
  15 |     
  16 |     // Assert Dev Mode badge is visible (from Gatekeeper layout bypass)
  17 |     await expect(page.locator('text=Dev Mode: Premium Unlocked')).toBeVisible();
  18 | 
  19 |     // 4. Interact with the Mind\'s Mirror (AI Prompt)
  20 |     // Adjust the placeholder selector based on the exact UI implementation
  21 |     const promptInput = page.locator('textarea');
  22 |     await expect(promptInput).toBeVisible();
  23 |     await promptInput.fill('أشعر بالضغط المستمر وأنني أركض في سباق لا ينتهي.');
  24 | 
  25 |     // Click the analysis button
  26 |     const analyzeButton = page.locator('button:has-text("تحليل")');
  27 |     await analyzeButton.click();
  28 | 
  29 |     // 5. Assert the AI Response renders successfully
  30 |     // Wait for the response container to appear and contain Arabic text
  31 |     await page.waitForSelector('.prose', { timeout: 20000 }); // Wait up to 20s for Gemini response
  32 |     const responseText = await page.locator('.prose').textContent();
  33 |     
  34 |     // Verify it contains a substantial philosophical response
  35 |     expect(responseText?.length).toBeGreaterThan(50);
  36 |   });
  37 | });
  38 | 
  39 | 
```