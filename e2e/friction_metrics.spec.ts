
import { test, expect } from '@playwright/test';

test.describe('Invisible Friction Metrics', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    const openBtn = page.getByRole('button', { name: /Open|Abrir/i });
    if (await openBtn.isVisible()) await openBtn.click();
  });

  // Since metrics are internal and memory-only, we can't easily assert them via DOM.
  // However, we can use `page.evaluate` to inspect the internal store if we exposed it,
  // OR we verify that the app behaves correctly (no errors) when these events occur.
  // For this test, we assume we might expose a debug method in dev mode, or we just ensure
  // the flow works without crashing.
  
  // NOTE: In a real scenario, we might expose window.__METRICS__ in test environment.
  // Here we just perform the actions to ensure no regression/crash.

  test('Early Typing triggers no errors', async ({ page }) => {
    await page.keyboard.press('Escape'); // Ensure blur
    await page.keyboard.type('abc'); // Early typing
    const input = page.getByPlaceholder(/Add task|Adicionar/i);
    await expect(input).toBeFocused();
    await expect(input).toHaveValue('abc');
  });

  test('Calendar Bounce Logic runs safely', async ({ page }) => {
    // Open Calendar
    await page.getByRole('button', { name: '📅' }).click();
    // Close immediately (Bounce)
    await page.getByRole('button', { name: '📝' }).click();
    
    // Verify we are back in list
    await expect(page.getByRole('button', { name: '📅' })).toBeVisible();
  });

  test('Focus Loss Logic runs safely', async ({ page }) => {
    const input = page.getByPlaceholder(/Add task|Adicionar/i);
    await input.focus();
    await page.keyboard.type('Draft text');
    
    // Click outside (blur)
    await page.getByRole('heading', { name: /To-Do To-Did/i }).click();
    
    await expect(input).not.toBeFocused();
    await expect(input).toHaveValue('Draft text'); // Draft preserved
  });

});
