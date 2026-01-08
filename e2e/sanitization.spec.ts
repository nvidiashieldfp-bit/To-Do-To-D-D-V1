
import { test, expect } from '@playwright/test';

/**
 * ============================================================================
 * TEST SUITE: UI SANITIZATION & REGRESSION AUDIT
 * PURPOSE: Mandatory check for "null"/"undefined" leakage and glare.
 * ============================================================================
 */

test.describe('Sanitization Audit', () => {

  test.beforeEach(async ({ page }) => {
    // 1. Inject Corrupted State directly into localStorage
    // This simulates data rot or bad LLM parsing that led to the bug.
    await page.addInitScript(() => {
        const corruptTasks = [
            {
                id: 'bad-1',
                title: 'Corrupt Task',
                completed: false,
                priority: 'MEDIUM',
                recurrence: 'null', // String null
                date: 'null',       // String null
                time: 'undefined',  // String undefined
                order: 0,
                createdAt: Date.now()
            },
            {
                id: 'bad-2',
                title: 'Null', // Literal title "Null" is allowed, but metadata isn't
                completed: false,
                priority: 'LOW',
                recurrence: null,
                date: null,
                time: null,
                order: 1,
                createdAt: Date.now()
            }
        ];
        
        const state = {
            tasks: corruptTasks,
            collapsedSections: [],
            viewMode: 'list',
            theme: 'light',
            language: 'en',
            visualPreset: 'editor',
            showLanding: false
        };
        
        localStorage.setItem('todo_to_did_v1', JSON.stringify(state));
    });

    await page.goto('/');
  });

  test('UI must NOT render "null" or "undefined" text nodes', async ({ page }) => {
    // Wait for load
    await expect(page.locator('body')).toBeVisible();

    // 1. Check Task Metadata (Time/Recurrence badges)
    // We strictly assert that the task row does NOT contain the visible text "null" or "undefined"
    const row = page.locator('.task-row').filter({ hasText: 'Corrupt Task' });
    
    // Locator-native assertions with built-in retries
    await expect(row).not.toContainText('null');
    await expect(row).not.toContainText('undefined');
    
    // Specifically check the recurrence button
    const recurBtn = row.locator('button').filter({ hasText: '🔁' }).first();
    await expect(recurBtn).toBeVisible(); 
    
    // Time badge check (should be hidden if null/undefined)
    const timeBadge = row.locator('.text-amber-500'); 
    await expect(timeBadge).not.toBeVisible();
  });

  test('FormatDisplayDate must handle "null" string gracefully', async ({ page }) => {
    // The "Corrupt Task" has date: "null".
    const row = page.locator('.task-row').filter({ hasText: 'Corrupt Task' });
    // Use .locator('..') for stable parent traversal instead of invalid .parentElement
    const dateBadgeParent = row.locator('input[type="date"]').locator('..');
    
    // Locator-native assertion on the parent container
    await expect(dateBadgeParent).not.toContainText('null');
    await expect(dateBadgeParent).not.toContainText('Invalid Date');
  });

  test('Light Mode Glare Check (Luminance Cap)', async ({ page }) => {
    // Visual regression check for brightness
    await page.evaluate(() => {
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-preset', 'editor');
    });

    const body = page.locator('body');
    // Sample the background color using evaluate on locator for complex calculation
    const bgColor = await body.evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor;
    });

    // Parse RGB
    const rgb = bgColor.match(/\d+/g)?.map(Number);
    if (!rgb) throw new Error('Could not parse background color');

    // Simple luminance calc: (0.299*R + 0.587*G + 0.114*B)
    const luminance = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]);
    
    // STRICT CAP: 245
    expect(luminance).toBeLessThan(245); 
    
    // Also check for pure white inputs using native CSS assertion
    const input = page.locator('#task-input');
    await expect(input).not.toHaveCSS('background-color', 'rgb(255, 255, 255)');
  });

});
