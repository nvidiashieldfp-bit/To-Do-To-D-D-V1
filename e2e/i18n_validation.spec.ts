
import { test, expect } from '@playwright/test';

/**
 * ============================================================================
 * TEST SUITE: INTERNATIONALIZATION & HOLIDAY REGRESSION
 * PURPOSE: Validate that changing country context correctly renders
 * specific national and regional holidays.
 * ============================================================================
 */

test.describe('Internationalization (I18n) & Holidays', () => {

  // Helper to inject specific context state
  const setContext = async (page: any, country: string, region: string, date: string) => {
    await page.addInitScript(({ c, r, d }) => {
      const state = {
        tasks: [],
        collapsedSections: [],
        viewMode: 'calendar', // Direct to calendar
        calendarViewType: 'monthly',
        calendarNavDate: d, // Navigate to target holiday date
        theme: 'light',
        language: 'en',
        country: c,
        region: r,
        holidayAwareness: true,
        showLanding: false
      };
      localStorage.setItem('todo_to_did_v1', JSON.stringify(state));
    }, { c: country, r: region, d: date });
    
    await page.goto('/');
  };

  test('Portugal (PT) - Should render "Dia da Liberdade" on Apr 25', async ({ page }) => {
    await setContext(page, 'PT', 'PT-CONTINENTAL', '2024-04-25');
    
    // Assert Calendar Header
    await expect(page.getByRole('heading', { level: 2 })).toContainText(/April 2024/i);

    // Assert Holiday Badge
    const holidayBadge = page.getByText('Dia da Liberdade');
    await expect(holidayBadge).toBeVisible();
    
    // Assert visual indicator
    const dayCell = page.locator('.bg-amber-500\\/5'); // Holiday background class
    await expect(dayCell).toBeVisible();
  });

  test('Portugal (PT-AZORES) - Should render Regional Holiday', async ({ page }) => {
    // 2024 Easter is March 31. +50 days = May 20 (Azores Day)
    await setContext(page, 'PT', 'PT-AZORES', '2024-05-20');
    
    await expect(page.getByText('Dia da Região Autónoma dos Açores')).toBeVisible();
  });

  test('USA (US) - Should render "Independence Day" on Jul 4', async ({ page }) => {
    await setContext(page, 'US', 'GENERIC', '2024-07-04');
    
    await expect(page.getByText('Independence Day')).toBeVisible();
  });

  test('Spain (ES) - Should render "Día de la Constitución" on Dec 6', async ({ page }) => {
    await setContext(page, 'ES', 'GENERIC', '2024-12-06');
    
    await expect(page.getByText('Día de la Constitución Española')).toBeVisible();
  });

  test('Disabling Holiday Awareness should hide holidays', async ({ page }) => {
    // Inject state with holidayAwareness: false
    await page.addInitScript(() => {
        const state = {
            viewMode: 'calendar',
            calendarNavDate: '2024-12-25',
            country: 'PT',
            region: 'PT-CONTINENTAL',
            holidayAwareness: false, // DISABLED
            showLanding: false
        };
        localStorage.setItem('todo_to_did_v1', JSON.stringify(state));
    });
    
    await page.goto('/');
    
    // Check Dec 25. Should NOT see "Natal"
    await expect(page.getByText('Natal')).not.toBeVisible();
  });

});
