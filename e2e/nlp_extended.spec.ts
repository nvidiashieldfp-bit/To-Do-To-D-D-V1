
import { test, expect } from '@playwright/test';

test.describe('Extended NLP Parsing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    const btn = page.getByRole('button', { name: /Open|Abrir/i });
    if (await btn.isVisible()) await btn.click();
  });

  test('Parses "alta prioridade" as High Priority', async ({ page }) => {
    const input = page.getByPlaceholder(/Add task/i);
    await input.fill('Reunião importante alta prioridade');
    await page.keyboard.press('Enter');
    
    const row = page.locator('.task-row').first();
    await expect(row.locator('.bg-rose-500')).toBeVisible();
    await expect(row).not.toContainText('alta prioridade');
  });

  test('Parses "segunda 14:30" correctly', async ({ page }) => {
    const input = page.getByPlaceholder(/Add task/i);
    await input.fill('Gym segunda 14:30');
    await page.keyboard.press('Enter');
    
    const row = page.locator('.task-row').first();
    await expect(row).toContainText('14:30');
    // Monday is localized, check if keyword is gone
    await expect(row).not.toContainText('segunda');
  });

  test('NLP never modifies text while typing', async ({ page }) => {
    const input = page.getByPlaceholder(/Add task/i);
    await input.type('urgent task');
    await expect(input).toHaveValue('urgent task');
  });
});
