
import { test, expect } from '@playwright/test';

test.describe('Keyboard Shortcuts', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    const btn = page.getByRole('button', { name: /Open|Abrir/i });
    if (await btn.isVisible()) await btn.click();
  });

  test('1, 2, 3 keys cycle priority on task row', async ({ page }) => {
    await page.getByPlaceholder(/Add task/i).fill('Test Task');
    await page.keyboard.press('Enter');
    
    const row = page.locator('.task-row').first();
    await row.focus();
    
    await page.keyboard.press('3');
    await expect(row.locator('.bg-rose-500')).toBeVisible();
    
    await page.keyboard.press('1');
    await expect(row.locator('.bg-emerald-500')).toBeVisible();
    
    await page.keyboard.press('2');
    await expect(row.locator('.bg-amber-500')).toBeVisible();
  });

  test('1, 2, 3 keys set priority on main input draft', async ({ page }) => {
    const input = page.getByPlaceholder(/Add task/i);
    await input.focus();
    
    await page.keyboard.press('3');
    const priorityBar = page.locator('form .bg-rose-500');
    await expect(priorityBar).toBeVisible();
    
    await input.type('High Priority Task');
    await page.keyboard.press('Enter');
    
    const row = page.locator('.task-row').first();
    await expect(row.locator('.bg-rose-500')).toBeVisible();
  });

  test('D and T keys trigger editors on task row', async ({ page }) => {
    await page.getByPlaceholder(/Add task/i).fill('Test Task');
    await page.keyboard.press('Enter');
    
    const row = page.locator('.task-row').first();
    await row.focus();
    
    // We can't easily check for system picker, so we check if the input is focused
    await page.keyboard.press('D');
    await expect(row.locator('input[type="date"]')).toBeFocused();
    
    await row.focus();
    await page.keyboard.press('T');
    await expect(row.locator('input[type="time"]')).toBeFocused();
  });
});
