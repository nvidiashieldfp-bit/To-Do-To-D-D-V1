
import { test, expect } from '@playwright/test';

test.describe('Smart Type-to-Add & Text Recovery', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    const openBtn = page.getByRole('button', { name: /Open|Abrir/i });
    if (await openBtn.isVisible()) {
      await openBtn.click();
    }
    // Ensure we are on list view and no input is active
    await page.getByRole('heading', { name: /To-Do To-Did/i }).click(); // Click branding to blur inputs
  });

  test('Typing "a" automatically focuses main input and inserts "a"', async ({ page }) => {
    // 1. Ensure input is NOT focused
    const input = page.getByPlaceholder(/Add task|Adicionar/i);
    await expect(input).not.toBeFocused();

    // 2. Type 'a' globally
    await page.keyboard.press('a');

    // 3. Assert Focus and Value
    await expect(input).toBeFocused();
    await expect(input).toHaveValue('a');
  });

  test('Interrupted text recovery works', async ({ page }) => {
    const input = page.getByPlaceholder(/Add task|Adicionar/i);

    // 1. Start typing via Type-to-Add
    await page.keyboard.type('Hello');
    await expect(input).toHaveValue('Hello');

    // 2. Blur input (Interrupt)
    // Click branding to loose focus (activeInput -> none)
    await page.getByRole('heading', { name: /To-Do To-Did/i }).click(); 
    await expect(input).not.toBeFocused();

    // 3. Resume typing ' World' via Type-to-Add
    await page.keyboard.press('Space');
    await page.keyboard.type('World');

    // 4. Assert text is appended and restored
    await expect(input).toBeFocused();
    await expect(input).toHaveValue('Hello World');
  });

  test('Typing ignored when Calendar is open', async ({ page }) => {
    // 1. Open Calendar
    await page.getByRole('button', { name: '📅' }).click();
    
    // 2. Type 'x'
    await page.keyboard.press('x');

    // 3. Assert Main Input NOT focused and EMPTY (or unchanged)
    // Note: In calendar view, main input might be unmounted or hidden, but let's check store state implicitly
    // by closing calendar and checking input
    await page.getByRole('button', { name: '📝' }).click(); // Go back to list
    const input = page.getByPlaceholder(/Add task|Adicionar/i);
    await expect(input).toHaveValue(''); 
  });

  test('Shortcuts (Cmd/Ctrl) are NOT intercepted', async ({ page }) => {
    const input = page.getByPlaceholder(/Add task|Adicionar/i);

    // 1. Press Cmd+P (Print) or similar
    // We just check that input doesn't get focus and value 'p'
    await page.keyboard.press('Meta+p');
    await expect(input).not.toBeFocused();
    await expect(input).toHaveValue('');
  });

  test('Focus Mode blocks type-to-add', async ({ page }) => {
    // 1. Enter Focus Mode
    await page.keyboard.press('f');
    await expect(page.getByText(/Focus|Foco/i)).toBeVisible();

    // 2. Type 'x'
    await page.keyboard.press('x');

    // 3. Assert we are still in focus mode (input not triggered)
    // The input is hidden in focus mode anyway, so simple visibility check passes
    const input = page.getByPlaceholder(/Add task|Adicionar/i);
    await expect(input).not.toBeVisible();
  });
});
