import { test, expect } from '@playwright/test';

/**
 * ============================================================================
 * TEST SUITE: Footer Invariant & Navigation Logic
 * DESCRIPTION: Ensures core UI components follow strict behavioral rules.
 * ============================================================================
 */

test.describe('UI Invariants', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    const openAppButton = page.getByRole('button', { name: /Open the app|Abrir a aplicação/i });
    if (await openAppButton.isVisible()) {
      await openAppButton.click();
    }
  });

  test('footer must adhere to visibility rules across all view states', async ({ page }) => {
    const footer = page.getByTestId('app-footer');

    // 1. Initial State: List View
    await expect(footer).toBeVisible();

    // 2. Calendar View
    await page.getByRole('button').filter({ hasText: '📅' }).click(); 
    await expect(footer).toBeVisible();

    // 3. Main Input Focus (must return to list view)
    await page.getByPlaceholder(/Add task/i).focus();
    await expect(footer).toBeVisible();

    // 4. Enter Focus Mode
    await page.keyboard.press('f');
    await expect(footer).not.toBeVisible();

    // 5. Exit Focus Mode
    await page.getByRole('button', { name: /End Session|Terminar Sessão/i }).click();
    await expect(footer).toBeVisible();
  });

  test('calendar must automatically close when main input is focused', async ({ page }) => {
    // 1. Open Calendar
    await page.getByRole('button').filter({ hasText: '📅' }).click();
    const calendarGrid = page.locator('#calendar-grid'); // Using locator based on CalendarView grid structure
    
    // 2. Focus Main Input
    await page.getByPlaceholder(/Add task/i).focus();
    
    // 3. Assert Calendar is unmounted/hidden
    await expect(calendarGrid).not.toBeVisible();
    
    // 4. Assert List View sections are visible
    await expect(page.getByText(/Today|Hoje/i)).toBeVisible();
  });
});