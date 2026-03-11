import { test, expect } from '@playwright/test';

test.describe('Language toggle', () => {
  test('switches from EN homepage to PT-BR homepage', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() =>
      document.getElementById('lang-switch')?.dispatchEvent(new Event('change'))
    );
    await page.waitForURL(/\/pt-br\//);
    await expect(page.locator('.lang-label.active')).toHaveText('PT');
  });

  test('switches from PT-BR homepage to EN homepage', async ({ page }) => {
    await page.goto('/pt-br/');
    await page.evaluate(() =>
      document.getElementById('lang-switch')?.dispatchEvent(new Event('change'))
    );
    await page.waitForURL(/\/(index\.html)?$/);
    await expect(page.locator('.lang-label.active')).toHaveText('EN');
  });

  test('switches from EN posts to PT-BR posts', async ({ page }) => {
    await page.goto('/posts/');
    await page.evaluate(() =>
      document.getElementById('lang-switch')?.dispatchEvent(new Event('change'))
    );
    await page.waitForURL('/pt-br/posts/');
  });
});

test.describe('Header navigation', () => {
  test('navigates to EN posts page from nav link', async ({ page }) => {
    await page.goto('/');
    await page.locator('.site-nav').getByRole('link', { name: 'Posts' }).click();
    await expect(page).toHaveURL('/posts/');
    await expect(page).toHaveTitle('Posts | André Borgonovo');
  });

  test('navigates to PT-BR posts page from nav link', async ({ page }) => {
    await page.goto('/pt-br/');
    await page.locator('.site-nav').getByRole('link', { name: 'Publicações' }).click();
    await expect(page).toHaveURL('/pt-br/posts/');
    await expect(page).toHaveTitle('Publicações | André Borgonovo');
  });

  test('logo link returns to EN homepage', async ({ page }) => {
    await page.goto('/posts/');
    await page.locator('.site-title').click();
    await expect(page).toHaveURL('/');
  });
});

test.describe('Post detail page', () => {
  test('EN post opens with correct title and content', async ({ page }) => {
    await page.goto('/posts/');
    await page.locator('.post-list a').first().click();
    await expect(page.locator('.post-header h1')).toBeVisible();
    await expect(page.locator('.post-content')).toBeVisible();
  });

  test('EN post footer has a back link to home', async ({ page }) => {
    await page.goto('/posts/');
    await page.locator('.post-list a').first().click();
    const backLink = page.locator('.post-footer a');
    await expect(backLink).toContainText('Back to home');
    await backLink.click();
    await expect(page).toHaveURL('/');
  });

  test('PT-BR post opens with correct title and content', async ({ page }) => {
    await page.goto('/pt-br/posts/');
    await page.locator('.post-list a').first().click();
    await expect(page.locator('.post-header h1')).toBeVisible();
    await expect(page.locator('.post-content')).toBeVisible();
  });
});
