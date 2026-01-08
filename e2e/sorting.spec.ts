
import { test, expect } from '@playwright/test';

test.describe('Intelligent Sorting', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    const btn = page.getByRole('button', { name: /Open|Abrir/i });
    if (await btn.isVisible()) await btn.click();
  });

  test('Priority sort correctly orders High -> Low', async ({ page }) => {
    const input = page.getByPlaceholder(/Add task/i);
    
    await input.fill('Low Task low');
    await page.keyboard.press('Enter');
    await input.fill('High Task urgent');
    await page.keyboard.press('Enter');
    
    // Trigger Priority Sort via CMD+K
    await page.keyboard.press('Control+k');
    await page.getByText('Sort: Priority').click();
    
    const rows = page.locator('.task-row');
    await expect(rows.nth(0)).toContainText('High Task');
    await expect(rows.nth(1)).toContainText('Low Task');
  });

  test('Energy sort prioritizes today and urgent keywords', async ({ page }) => {
    const input = page.getByPlaceholder(/Add task/i);
    
    await input.fill('Normal Task tomorrow');
    await page.keyboard.press('Enter');
    await input.fill('Reunião urgente');
    await page.keyboard.press('Enter');
    
    await page.keyboard.press('Control+k');
    await page.getByText('Sort: Energy').click();
    
    const rows = page.locator('.task-row');
    await expect(rows.nth(0)).toContainText('Reunião');
  });
});
