import { test, expect } from '@playwright/test';

test('submit website in IPD navigation and verify it appears', async ({ page }) => {
  // 1. Go to IPD navigation page
  await page.goto('http://localhost:3001/ipd-navigation');
  
  // 2. Select "需求调研" (it should be selected by default, but let's click it to be sure)
  await page.click('text=需求调研');
  
  // 3. Click "提交网站" button
  await page.click('button:has-text("提交网站")');
  
  // 4. Fill the form
  const testTitle = 'IPD Test Site ' + Date.now();
  await page.fill('input[placeholder="网站名称"]', testTitle);
  await page.fill('input[placeholder="网站链接 (https://...)"]', 'https://test-ipd.com');
  await page.fill('textarea[placeholder="网站描述..."]', 'This is a test site for IPD navigation.');
  
  // 5. Submit the form
  await page.click('button[type="submit"]:has-text("提交")');
  
  // 6. Wait for success message
  await expect(page.locator('text=提交成功')).toBeVisible();
  
  // 7. Verify the site appears in the list
  // The page should automatically switch back to "list" mode
  await expect(page.locator(`text=${testTitle}`)).toBeVisible();
});
