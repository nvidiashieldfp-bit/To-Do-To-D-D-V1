import { test, expect } from '@playwright/test';

/**
 * ============================================================================
 * TEST SUITE: AUTHORITY REGRESSION (CRITICAL)
 * PURPOSE: Enforce the "One Active Input" rule.
 * RULE: The Calendar and the Main Task Input context must NEVER coexist.
 * ============================================================================
 */

test.describe('Critical Authority: One Active Input', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    
    const openBtn = page.getByRole('button', { name: /Open|Abrir/i });
    if (await openBtn.isVisible()) {
      await openBtn.click();
    }
    
    const calendarToggle = page.getByRole('button', { name: '📅' });
    // Use regex to detect calendar headers across supported languages
    const isCalendarView = await page.getByText(/Sun|Dom|Dim/).first().isVisible();
                           
    if (isCalendarView) {
      await page.getByPlaceholder(/Add task|Adicionar/i).focus();
    }
  });

  test('Scenario 1: Focusing Task Input must strictly close Calendar', async ({ page }) => {
    await page.getByRole('button', { name: '📅' }).click();
    
    const calendarGrid = page.getByText(/Sun|Dom|Dim/).first();
    await expect(calendarGrid).toBeVisible();

    await page.getByPlaceholder(/Add task|Adicionar/i).focus();

    await expect(calendarGrid).not.toBeVisible();
    
    const todaySection = page.getByText(/Today|Hoje/i).first();
    await expect(todaySection).toBeVisible();
  });

  test('Scenario 2: Opening Calendar must shift context (hide List)', async ({ page }) => {
    const todaySection = page.getByText(/Today|Hoje/i).first();
    await expect(todaySection).toBeVisible();

    await page.getByRole('button', { name: '📅' }).click();

    const calendarGrid = page.getByText(/Sun|Dom|Dim/).first();
    await expect(calendarGrid).toBeVisible();
    
    await expect(todaySection).not.toBeVisible();
  });

  test('Scenario 3: Internal Calendar Toggles must not break Input Authority', async ({ page }) => {
    await page.getByRole('button', { name: '📅' }).click();
    
    const weekBtn = page.getByRole('button', { name: /Week|Semana/i });
    if (await weekBtn.isVisible()) {
        await weekBtn.click();
    }

    await page.getByPlaceholder(/Add task|Adicionar/i).focus();

    const calendarGrid = page.getByText(/Sun|Dom|Dim/).first();
    await expect(calendarGrid).not.toBeVisible();
  });

  test('Scenario 4: Regression Guard - Re-renders do not resurrect Calendar', async ({ page }) => {
    await page.getByRole('button', { name: '📅' }).click();
    
    await page.getByRole('button', { name: '▶️' }).click();
    
    await page.getByPlaceholder(/Add task|Adicionar/i).click(); 
    
    const calendarGrid = page.getByText(/Sun|Dom|Dim/).first();
    await expect(calendarGrid).not.toBeVisible();
  });

});