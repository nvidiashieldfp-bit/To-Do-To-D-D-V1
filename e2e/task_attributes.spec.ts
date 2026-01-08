import { test, expect } from '@playwright/test';

/**
 * ============================================================================
 * TEST SUITE: Task Attributes & Scheduling logic
 * DESCRIPTION: Validates that metadata (Priority, Date, Time) is parsed,
 * displayed, and updated correctly using native Playwright locators.
 * ============================================================================
 */

test.describe('Task Attributes: Priority & Scheduling', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    const openBtn = page.getByRole('button', { name: /Open|Abrir/i });
    if (await openBtn.isVisible()) {
      await openBtn.click();
    }
  });

  test('Priority toggle is visible and interactive near input', async ({ page }) => {
    const priorityToggle = page.locator('form button[title*="Priority"]').first();
    await expect(priorityToggle).toBeVisible();

    // Click to cycle: Medium (Amber) -> High (Rose)
    await priorityToggle.click(); 
    await expect(priorityToggle).toHaveClass(/bg-rose-500|bg-red-500/);

    await page.getByPlaceholder(/Add task|Adicionar/i).fill('Urgent Task');
    await page.keyboard.press('Enter');

    const taskRow = page.locator('.task-row').filter({ hasText: 'Urgent Task' });
    await expect(taskRow).toBeVisible();
    await expect(taskRow.locator('.priority-bar.HIGH')).toBeVisible();
  });

  test('Inline Date/Time editing is functional for existing tasks', async ({ page }) => {
    await page.getByPlaceholder(/Add task|Adicionar/i).fill('Schedule Me');
    await page.keyboard.press('Enter');

    const taskRow = page.locator('.task-row').filter({ hasText: 'Schedule Me' });
    
    // Hover to reveal meta controls
    await taskRow.hover();
    
    // Find Date Trigger using the stable title attribute
    const dateTrigger = taskRow.locator('div[title="Schedule Date"]');
    await expect(dateTrigger).toBeVisible();

    const dateInput = dateTrigger.locator('input[type="date"]');
    await dateInput.fill('2024-12-25');

    // Assert localized date badge text using native locator assertion
    await expect(taskRow).toContainText(/Dec 25|Dez 25/i);

    const timeTrigger = taskRow.locator('div[title="Set Time"]');
    await expect(timeTrigger).toBeVisible();

    const timeInput = timeTrigger.locator('input[type="time"]');
    await timeInput.fill('14:30');

    await expect(taskRow).toContainText('14:30');
  });

  test('Calendar Drag preserves Time when moving date in Monthly view', async ({ page }) => {
    await page.getByPlaceholder(/Add task|Adicionar/i).fill('Doctor 10:00');
    await page.keyboard.press('Enter');

    await page.getByRole('button', { name: '📅' }).click();

    const taskChip = page.locator('.cal-task-chip').filter({ hasText: 'Doctor' });
    await expect(taskChip).toBeVisible();

    // Use .locator('..') to find a parent for context or debugging if needed, 
    // though dragTo works directly on the source locator.
    const calendarCell = page.locator('.cal-day').nth(20);
    await taskChip.dragTo(calendarCell);

    // Return to list view to verify data persistence
    await page.getByRole('button', { name: '📝' }).click();
    
    const taskRow = page.locator('.task-row').filter({ hasText: 'Doctor' });
    await expect(taskRow).toContainText('10:00'); 
  });

});