import { test, expect } from '@playwright/test';

test.describe('English homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('has correct page title', async ({ page }) => {
    await expect(page).toHaveTitle('Home | André Borgonovo');
  });

  test('has English navigation links', async ({ page }) => {
    const nav = page.locator('.site-nav');
    await expect(nav.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Posts' })).toBeVisible();
  });

  test('shows EN as active language', async ({ page }) => {
    await expect(page.locator('.lang-label.active')).toHaveText('EN');
  });

  test('renders hero section with site title', async ({ page }) => {
    await expect(page.locator('.hero-compact h1')).toHaveText('André Borgonovo');
  });

  test('shows social profile badges', async ({ page }) => {
    const badges = page.locator('.hero-badges');
    await expect(badges.getByRole('link', { name: 'GitHub' })).toBeVisible();
    await expect(badges.getByRole('link', { name: 'LinkedIn' })).toBeVisible();
    await expect(badges.getByRole('link', { name: 'X' })).toBeVisible();
  });

  test('shows latest posts in sidebar', async ({ page }) => {
    await expect(page.locator('.home-sidebar')).toContainText('Latest Posts');
    await expect(page.locator('.sidebar-posts')).toBeVisible();
  });

  test('has social links in footer', async ({ page }) => {
    const footer = page.locator('.site-footer');
    await expect(footer.locator('[aria-label="GitHub"]')).toBeVisible();
    await expect(footer.locator('[aria-label="LinkedIn"]')).toBeVisible();
    await expect(footer.locator('[aria-label="X"]')).toBeVisible();
  });

  test('footer shows "Built with Jekyll"', async ({ page }) => {
    await expect(page.locator('.footer-text').first()).toContainText('Built with Jekyll');
  });
});

test.describe('PT-BR homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/pt-br/');
  });

  test('has correct page title', async ({ page }) => {
    await expect(page).toHaveTitle(/André Borgonovo/);
  });

  test('has Portuguese navigation links', async ({ page }) => {
    const nav = page.locator('.site-nav');
    await expect(nav.getByRole('link', { name: 'Início' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Publicações' })).toBeVisible();
  });

  test('shows PT as active language', async ({ page }) => {
    await expect(page.locator('.lang-label.active')).toHaveText('PT');
  });

  test('renders hero section with site title', async ({ page }) => {
    await expect(page.locator('.hero-compact h1')).toHaveText('André Borgonovo');
  });

  test('shows latest posts in sidebar in Portuguese', async ({ page }) => {
    await expect(page.locator('.home-sidebar')).toContainText('Últimas Publicações');
    await expect(page.locator('.sidebar-posts')).toBeVisible();
  });

  test('footer shows "Feito com Jekyll"', async ({ page }) => {
    await expect(page.locator('.footer-text').first()).toContainText('Feito com Jekyll');
  });
});
