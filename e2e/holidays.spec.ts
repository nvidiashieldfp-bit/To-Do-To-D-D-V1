
import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

/**
 * ============================================================================
 * TEST SUITE: HOLIDAY DATA INTEGRITY & SAFEGUARDS
 * PURPOSE: Ensure new countries added to the system do not break the app.
 * ============================================================================
 */

const TEMPLATE_PATH = path.resolve('docs/schemas/HOLIDAY_TEMPLATE.json');

test.describe('Universal Holiday Safeguards', () => {

  test('HOLIDAY_TEMPLATE.json must be valid JSON', async () => {
    const raw = fs.readFileSync(TEMPLATE_PATH, 'utf-8');
    let json;
    try {
      json = JSON.parse(raw);
    } catch (e) {
      throw new Error('HOLIDAY_TEMPLATE.json is malformed');
    }
    expect(json).toHaveProperty('$schema');
    expect(json).toHaveProperty('required');
  });

  test('Current Runtime Logic (PT) must return valid ISO dates', async ({ page }) => {
    // Navigate to app with PT context
    await page.addInitScript(() => {
        localStorage.setItem('todo_to_did_v1', JSON.stringify({
            country: 'PT',
            region: 'PT-CONTINENTAL',
            holidayAwareness: true,
            showLanding: false
        }));
    });
    await page.goto('/');

    await expect(page.locator('body')).toBeVisible();
    
    // Critical: Ensure no "Invalid Date" or "NaN" text appears via Locator-native assertions
    // These matchers have built-in retry logic which is safer than innerText() checks
    const body = page.locator('body');
    await expect(body).not.toContainText('Invalid Date');
    await expect(body).not.toContainText('NaN');
  });

  test('Network Invariant: No external requests for holiday data', async ({ page }) => {
    let externalRequest = false;
    
    page.on('request', request => {
        const url = request.url();
        if (!url.includes('localhost') && !url.includes('127.0.0.1') && !url.startsWith('data:')) {
            if (url.includes('holidays') || url.includes('api')) {
                externalRequest = true;
            }
        }
    });

    await page.goto('/');
    
    // Trigger calendar view which loads holidays
    await page.getByRole('button', { name: '📅' }).click();
    
    expect(externalRequest).toBe(false);
  });

  test('New Country Simulation: Fallback to Generic', async ({ page }) => {
    // Inject unknown country
    await page.addInitScript(() => {
        localStorage.setItem('todo_to_did_v1', JSON.stringify({
            country: 'XX', // Unknown Code
            region: 'UNKNOWN',
            holidayAwareness: true
        }));
    });

    await page.goto('/');
    
    // App should not crash. Footer should show country code or generic.
    await expect(page.getByTestId('app-footer')).toBeVisible();
    
    // Should render without holiday errors
    await expect(page.locator('body')).not.toContainText('Error');
  });

});
