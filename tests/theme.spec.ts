import { test, expect } from '@playwright/test';

test.describe('Theme toggle', () => {
  test('defaults to dark theme when system prefers dark', async ({ browser }) => {
    const context = await browser.newContext({ colorScheme: 'dark' });
    const page = await context.newPage();
    await page.goto('/');
    const theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(theme).toBe('dark');
    await context.close();
  });

  test('defaults to light theme when system prefers light', async ({ browser }) => {
    const context = await browser.newContext({ colorScheme: 'light' });
    const page = await context.newPage();
    await page.goto('/');
    const theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(theme).toBe('light');
    await context.close();
  });

  test('switches to light theme on toggle click', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('theme', 'dark'));
    await page.goto('/');
    await page.locator('#theme-toggle').click();
    const theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(theme).toBe('light');
  });

  test('switches back to dark theme from light', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('theme', 'light'));
    await page.goto('/');
    await page.locator('#theme-toggle').click();
    const theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(theme).toBe('dark');
  });

  test('persists light theme across page reload', async ({ page }) => {
    await page.goto('/');
    // Set localStorage directly (bypasses addInitScript re-run on reload)
    await page.evaluate(() => localStorage.setItem('theme', 'light'));
    await page.reload();
    const theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(theme).toBe('light');
  });

  test('aria-label reflects current theme state', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('theme', 'dark'));
    await page.goto('/');
    const toggle = page.locator('#theme-toggle');
    await expect(toggle).toHaveAttribute('aria-label', 'Switch to light mode');
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-label', 'Switch to dark mode');
  });

  test('moon icon visible in dark mode, sun icon visible in light mode', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('theme', 'dark'));
    await page.goto('/');
    await expect(page.locator('.theme-icon-moon')).toBeVisible();
    await expect(page.locator('.theme-icon-sun')).toBeHidden();
    await page.locator('#theme-toggle').click();
    await expect(page.locator('.theme-icon-sun')).toBeVisible();
    await expect(page.locator('.theme-icon-moon')).toBeHidden();
  });
});
