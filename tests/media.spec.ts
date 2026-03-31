import { test, expect } from '@playwright/test';

test.describe('English media page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/media/');
  });

  test('has correct page title', async ({ page }) => {
    await expect(page).toHaveTitle('Media | André Borgonovo');
  });

  test('has Media link active in navigation', async ({ page }) => {
    const nav = page.locator('.site-nav');
    await expect(nav.getByRole('link', { name: 'Media' })).toHaveClass(/active/);
  });

  test('renders page heading', async ({ page }) => {
    await expect(page.locator('.media-page h1')).toBeVisible();
  });

  test('renders at least one media section', async ({ page }) => {
    await expect(page.locator('.media-section').first()).toBeVisible();
  });

  test('renders media cards', async ({ page }) => {
    await expect(page.locator('.media-card').first()).toBeVisible();
  });

  test('media cards have type badges', async ({ page }) => {
    await expect(page.locator('.media-type-badge').first()).toBeVisible();
  });

  test('media cards have CTA links', async ({ page }) => {
    await expect(page.locator('.media-card-cta').first()).toBeVisible();
  });
});

test.describe('PT-BR media page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/pt-br/media/');
  });

  test('has Mídia link active in navigation', async ({ page }) => {
    const nav = page.locator('.site-nav');
    await expect(nav.getByRole('link', { name: 'Mídia' })).toHaveClass(/active/);
  });

  test('renders page heading in Portuguese', async ({ page }) => {
    await expect(page.locator('.media-page h1')).toBeVisible();
  });

  test('renders podcast CTA in Portuguese', async ({ page }) => {
    const podcastCard = page.locator('.media-card--podcast').first();
    await expect(podcastCard.locator('.media-card-cta')).toContainText('Ouvir');
  });

  test('renders video CTA in Portuguese', async ({ page }) => {
    const videoCard = page.locator('.media-card--video').first();
    await expect(videoCard.locator('.media-card-cta')).toContainText('Assistir');
  });

  test('renders template CTA in Portuguese', async ({ page }) => {
    const templateCard = page.locator('.media-card--template').first();
    await expect(templateCard.locator('.media-card-cta')).toContainText('Abrir Template');
  });

  test('video section heading is in Portuguese', async ({ page }) => {
    const videoSection = page.locator('.media-section').filter({ has: page.locator('.media-card--video') });
    await expect(videoSection.locator('.media-section-heading')).toContainText('Entrevistas em Vídeo');
  });
});

test.describe('media page navigation links', () => {
  test('EN homepage has Media nav link', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.site-nav').getByRole('link', { name: 'Media' })).toBeVisible();
  });

  test('PT-BR homepage has Mídia nav link', async ({ page }) => {
    await page.goto('/pt-br/');
    await expect(page.locator('.site-nav').getByRole('link', { name: 'Mídia' })).toBeVisible();
  });
});
