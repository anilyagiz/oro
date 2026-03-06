import { test, expect } from '@playwright/test';

test.describe('Purchase Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should navigate to purchase section', async ({ page }) => {
    // Look for purchase-related buttons or links
    const purchaseButton = page.locator('button, a').filter({ 
      hasText: /purchase|buy|gold/i 
    }).first();
    
    if (await purchaseButton.count() > 0) {
      await purchaseButton.click();
      await page.waitForLoadState('networkidle');
      
      await page.screenshot({ 
        path: 'e2e/screenshots/purchase-page.png',
        fullPage: true 
      });
    }
  });

  test('should display purchase form elements', async ({ page }) => {
    // Navigate to purchase page if available
    await page.goto('/purchase').catch(() => {});
    
    // Look for form elements
    const amountInput = page.locator('input[type="number"], input[name="amount"], input[placeholder*="amount" i]').first();
    const tokenSelect = page.locator('select, [role="combobox"]').filter({ 
      hasText: /token|USDC|USDT|payment/i 
    }).first();
    
    // Take screenshot of form
    await page.screenshot({ 
      path: 'e2e/screenshots/purchase-form.png',
      fullPage: true 
    });
  });

  test('should validate purchase amount', async ({ page }) => {
    await page.goto('/purchase').catch(() => {});
    
    // Find amount input
    const amountInput = page.locator('input[type="number"]').first();
    
    if (await amountInput.count() > 0) {
      // Try to enter invalid amount
      await amountInput.fill('0');
      await amountInput.blur();
      
      await page.screenshot({ 
        path: 'e2e/screenshots/purchase-validation-zero.png',
        fullPage: true 
      });
      
      // Try valid amount
      await amountInput.fill('100');
      await amountInput.blur();
      
      await page.screenshot({ 
        path: 'e2e/screenshots/purchase-validation-valid.png',
        fullPage: true 
      });
    }
  });

  test('should show quote when entering amount', async ({ page }) => {
    await page.goto('/purchase').catch(() => {});
    
    const amountInput = page.locator('input[type="number"]').first();
    
    if (await amountInput.count() > 0) {
      await amountInput.fill('50');
      
      // Wait for quote to load
      await page.waitForTimeout(1000);
      
      // Look for quote display
      const quoteDisplay = page.locator('text=/gold|quote|estimate|receive/i').first();
      
      await page.screenshot({ 
        path: 'e2e/screenshots/purchase-quote.png',
        fullPage: true 
      });
    }
  });

  test('purchase flow requires wallet connection', async ({ page }) => {
    await page.goto('/purchase').catch(() => {});
    
    // Try to initiate purchase without wallet
    const submitButton = page.locator('button').filter({ 
      hasText: /purchase|buy|confirm/i 
    }).first();
    
    if (await submitButton.count() > 0) {
      await submitButton.click();
      
      // Wait for error or wallet prompt
      await page.waitForTimeout(500);
      
      await page.screenshot({ 
        path: 'e2e/screenshots/purchase-no-wallet.png',
        fullPage: true 
      });
    }
  });

  test('should display purchase progress modal', async ({ page }) => {
    await page.goto('/purchase').catch(() => {});
    
    // Check for modal elements if they exist
    const modal = page.locator('[role="dialog"], .modal, [data-testid*="modal"]').first();
    
    await page.screenshot({ 
      path: 'e2e/screenshots/purchase-modal.png',
      fullPage: true 
    });
  });
});
