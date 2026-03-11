import { test, expect } from '@playwright/test';

test.describe('EN posts listing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/posts/');
  });

  test('has correct page title', async ({ page }) => {
    await expect(page).toHaveTitle('Posts | André Borgonovo');
  });

  test('shows EN posts', async ({ page }) => {
    await expect(page.locator('.post-list')).toContainText('From events to podcasts');
  });

  test('does not show PT-BR posts', async ({ page }) => {
    await expect(page.locator('.post-list')).not.toContainText('De eventos a podcasts');
  });
});

test.describe('PT-BR posts listing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/pt-br/posts/');
  });

  test('has correct page title', async ({ page }) => {
    await expect(page).toHaveTitle('Publicações | André Borgonovo');
  });

  test('shows PT-BR posts', async ({ page }) => {
    await expect(page.locator('.post-list')).toContainText('De eventos a podcasts');
  });

  test('does not show EN posts', async ({ page }) => {
    await expect(page.locator('.post-list')).not.toContainText('From events to podcasts');
  });
});
