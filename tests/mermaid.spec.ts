import { test, expect } from '@playwright/test';

test.describe('Mermaid diagrams', () => {
  test('renders mermaid diagram as SVG', async ({ page }) => {
    await page.goto('/coding/2026/05/18/fifo-sns-sqs-eks-terraform/');
    await expect(page.locator('.mermaid svg')).toBeVisible();
  });
});
