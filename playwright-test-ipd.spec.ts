import { test, expect } from '@playwright/test';

test('submit website in IPD navigation and verify it appears', async ({ page }) => {
  await page.goto('http://localhost:3001/ipd-navigation');

  await page.click('text=需求阶段');

  await page.click('button:has-text("提交网站")');

  const testTitle = 'IPD Test Site ' + Date.now();
  await page.fill('input[placeholder="网站名称"]', testTitle);
  await page.fill('input[placeholder="网站链接 (https://...)"]', 'https://test-ipd.com');
  await page.fill('textarea[placeholder="网站描述..."]', 'This is a test site for IPD navigation.');

  await page.click('button[type="submit"]:has-text("提交")');

  await expect(page.locator('text=提交成功')).toBeVisible();

  await expect(page.locator(`text=${testTitle}`)).toBeVisible();
});
