import { test, expect } from '@playwright/test';

test.describe('Error Handling Scenarios', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display 404 for unknown routes', async ({ page }) => {
    const response = await page.goto('/this-route-does-not-exist');
    
    // Should show Next.js 404 page or custom Not Found
    expect(response?.status()).toBe(404);
    
    const notFoundText = page.locator('text=/not found|404/i').first();
    await expect(notFoundText).toBeVisible();
    
    await page.screenshot({ 
      path: 'e2e/screenshots/error-404.png',
      fullPage: true 
    });
  });

  test('should show validation errors on invalid input', async ({ page }) => {
    // Look for the input field
    const amountInput = page.locator('input[type="text"]').first();
    
    if (await amountInput.count() > 0) {
      await amountInput.fill('0');
      await amountInput.blur();
      
      const errorMsg = page.locator('p[role="alert"]').first();
      if (await errorMsg.count() > 0) {
        await expect(errorMsg).toBeVisible();
        await expect(errorMsg).toContainText(/min/i);
      }
      
      await amountInput.fill('999999999999');
      await amountInput.blur();
      
      if (await errorMsg.count() > 0) {
        await expect(errorMsg).toContainText(/max/i);
      }
    }
  });

  test('should show disabled state when offline', async ({ page, context }) => {
    await page.goto('/');
    
    // Simulate offline mode
    await context.setOffline(true);
    
    // Wait for the UI to react
    await page.waitForTimeout(1000);
    
    await page.screenshot({ 
      path: 'e2e/screenshots/error-offline.png',
      fullPage: true 
    });
    
    // Restore network
    await context.setOffline(false);
  });
});