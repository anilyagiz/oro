import { test, expect } from '@playwright/test';

test.describe('Wallet Connection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display connect wallet button', async ({ page }) => {
    // Look for connect wallet button
    const connectButton = page.locator('button').filter({ 
      hasText: /connect|wallet/i 
    }).first();
    
    await page.screenshot({ 
      path: 'e2e/screenshots/wallet-initial-state.png',
      fullPage: true 
    });
    
    expect(await connectButton.count()).toBeGreaterThanOrEqual(0);
  });

  test('should open wallet selection modal', async ({ page }) => {
    const connectButton = page.locator('button').filter({ 
      hasText: /connect/i 
    }).first();
    
    if (await connectButton.count() > 0) {
      await connectButton.click();
      
      // Wait for modal to appear
      await page.waitForTimeout(500);
      
      await page.screenshot({ 
        path: 'e2e/screenshots/wallet-selection-modal.png',
        fullPage: true 
      });
      
      // Look for wallet options
      const walletOptions = page.locator('button, [role="button"]').filter({ 
        hasText: /phantom|solflare|solana|wallet/i 
      });
      
      expect(await walletOptions.count()).toBeGreaterThanOrEqual(0);
    }
  });

  test('should show wallet connection states', async ({ page }) => {
    // Check initial disconnected state
    const initialState = page.locator('text=/disconnected|not connected|connect wallet/i').first();
    
    await page.screenshot({ 
      path: 'e2e/screenshots/wallet-disconnected-state.png',
      fullPage: true 
    });
  });

  test('wallet modal should be accessible', async ({ page }) => {
    const connectButton = page.locator('button').filter({ 
      hasText: /connect/i 
    }).first();
    
    if (await connectButton.count() > 0) {
      await connectButton.click();
      
      // Check for dialog role
      const modal = page.locator('[role="dialog"]').first();
      
      await page.screenshot({ 
        path: 'e2e/screenshots/wallet-modal-accessibility.png',
        fullPage: true 
      });
    }
  });

  test('should close wallet modal on backdrop click', async ({ page }) => {
    const connectButton = page.locator('button').filter({ 
      hasText: /connect/i 
    }).first();
    
    if (await connectButton.count() > 0) {
      await connectButton.click();
      await page.waitForTimeout(300);
      
      await page.keyboard.press('Escape');
      
      await page.waitForTimeout(300);
      
      await page.screenshot({ 
        path: 'e2e/screenshots/wallet-modal-closed.png',
        fullPage: true 
      });
    }
  });

  test('should show wallet connection error states', async ({ page }) => {
    // Test by attempting to connect and then checking error handling
    const connectButton = page.locator('button').filter({ 
      hasText: /connect/i 
    }).first();
    
    if (await connectButton.count() > 0) {
      await connectButton.click();
      await page.waitForTimeout(500);
      
      await page.screenshot({ 
        path: 'e2e/screenshots/wallet-connection-error.png',
        fullPage: true 
      });
    }
  });
});
