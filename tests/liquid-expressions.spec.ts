import { test, expect } from '@playwright/test';

const liquidExpressions = [
  '{{gitlabProject}} will be added to {{issueKeys}}'
];

test.describe('EN Liquid expressions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/general/2026/03/19/gitlab-jira-automation.html');
  });

  for (const expr of liquidExpressions) {
    test(`renders Liquid expression literally: ${expr}`, async ({ page }) => {
      await expect(page.locator('.post-content')).toContainText(expr);
    });
  }
});

test.describe('PT-BR Liquid expressions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/pt-br/geral/2026/03/19/gitlab-jira-automation-pt-br.html');
  });

  for (const expr of liquidExpressions) {
    test(`renders Liquid expression literally: ${expr}`, async ({ page }) => {
      await expect(page.locator('.post-content')).toContainText(expr);
    });
  }
});
