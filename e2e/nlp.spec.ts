
import { test, expect } from '@playwright/test';

test.describe('Lightweight NLP (Offline)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    const openBtn = page.getByRole('button', { name: /Open|Abrir/i });
    if (await openBtn.isVisible()) await openBtn.click();
  });

  test('Extracts "urgent" priority and removes keyword', async ({ page }) => {
    const input = page.getByPlaceholder(/Add task|Adicionar/i);
    
    // Type task with "urgent"
    await input.focus();
    await page.keyboard.type('Buy milk urgent');
    await page.keyboard.press('Enter');

    // Expect task in "NOW" or "TODAY" (High priority usually goes to NOW if Today, but logic depends on store)
    // We mainly check the Title and Visual Indicator
    const taskRow = page.locator('.task-row').first();
    await expect(taskRow).toContainText('Buy milk');
    await expect(taskRow).not.toContainText('urgent'); // Keyword removed
    
    // Check priority bar color (High = Rose/Red)
    const priorityBar = taskRow.locator('.bg-rose-500').or(taskRow.locator('.bg-red-500')); // Adjust based on Tailwind config
    // Actually, check if it has the HIGH priority class
    // In constants.tsx: HIGH = 'bg-rose-500'
    await expect(taskRow.locator('.bg-rose-500')).toBeVisible(); 
  });

  test('Extracts "tomorrow" and schedules correctly', async ({ page }) => {
    const input = page.getByPlaceholder(/Add task|Adicionar/i);
    await input.focus();
    await page.keyboard.type('Meeting tomorrow');
    await page.keyboard.press('Enter');

    // Should appear in "Tomorrow" section
    // We check if the "Tomorrow" section count increased or if task is there
    const section = page.locator('#section-TOMORROW');
    await expect(section).toContainText('Meeting');
    await expect(section).not.toContainText('tomorrow'); // Keyword removed
  });

  test('Extracts time "15:30" and preserves simple title', async ({ page }) => {
    const input = page.getByPlaceholder(/Add task|Adicionar/i);
    await input.focus();
    await page.keyboard.type('Dentist 15:30');
    await page.keyboard.press('Enter');

    const taskRow = page.locator('.task-row').filter({ hasText: 'Dentist' });
    await expect(taskRow).toBeVisible();
    await expect(taskRow).toContainText('15:30'); // Time badge
    const title = taskRow.locator('.truncate').first();
    await expect(title).toHaveText('Dentist'); // Clean title
  });

  test('Ignores NLP when typing (only on submit)', async ({ page }) => {
    const input = page.getByPlaceholder(/Add task|Adicionar/i);
    await input.focus();
    await page.keyboard.type('Meeting tomorrow');
    
    // While typing, the text should be exactly what user typed
    await expect(input).toHaveValue('Meeting tomorrow');
    // No extraction happened yet
  });

});
