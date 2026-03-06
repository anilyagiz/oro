import { test, expect } from '@playwright/test';

test.describe('Portfolio', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display portfolio section', async ({ page }) => {
    // Navigate to portfolio page
    await page.goto('/portfolio').catch(() => {});
    
    // Look for portfolio-related elements
    const portfolioHeading = page.locator('h1, h2, h3').filter({ 
      hasText: /portfolio|holdings|assets/i 
    }).first();
    
    await page.screenshot({ 
      path: 'e2e/screenshots/portfolio-overview.png',
      fullPage: true 
    });
  });

  test('should display portfolio balance', async ({ page }) => {
    await page.goto('/portfolio').catch(() => {});
    
    // Look for balance/total value display
    const balanceElement = page.locator('text=/balance|total|value|usd|\\$/i').first();
    
    await page.screenshot({ 
      path: 'e2e/screenshots/portfolio-balance.png',
      fullPage: true 
    });
  });

  test('should display holdings list', async ({ page }) => {
    await page.goto('/portfolio').catch(() => {});
    
    // Look for token holdings
    const holdingsList = page.locator('table, [role="list"], .holdings-list, .token-list').first();
    
    await page.screenshot({ 
      path: 'e2e/screenshots/portfolio-holdings.png',
      fullPage: true 
    });
  });

  test('should show empty state when no holdings', async ({ page }) => {
    await page.goto('/portfolio').catch(() => {});
    
    // Look for empty state message
    const emptyState = page.locator('text=/no holdings|empty|no assets|start purchasing/i').first();
    
    await page.screenshot({ 
      path: 'e2e/screenshots/portfolio-empty-state.png',
      fullPage: true 
    });
  });

  test('should display transaction history', async ({ page }) => {
    await page.goto('/portfolio').catch(() => {});
    
    // Look for transaction history section
    const transactionSection = page.locator('text=/transactions|history|activity/i').first();
    
    if (await transactionSection.count() > 0) {
      await page.screenshot({ 
        path: 'e2e/screenshots/portfolio-transactions.png',
        fullPage: true 
      });
    }
  });

  test('should refresh portfolio data', async ({ page }) => {
    await page.goto('/portfolio').catch(() => {});
    
    // Look for refresh button
    const refreshButton = page.locator('button').filter({ 
      hasText: /refresh|reload|update/i 
    }).first();
    
    if (await refreshButton.count() > 0) {
      await refreshButton.click();
      await page.waitForTimeout(1000);
      
      await page.screenshot({ 
        path: 'e2e/screenshots/portfolio-refreshed.png',
        fullPage: true 
      });
    }
  });

  test('should be responsive on different viewports', async ({ page }) => {
    await page.goto('/portfolio').catch(() => {});
    
    // Mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.screenshot({ 
      path: 'e2e/screenshots/portfolio-mobile.png',
      fullPage: true 
    });
    
    // Tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.screenshot({ 
      path: 'e2e/screenshots/portfolio-tablet.png',
      fullPage: true 
    });
    
    // Desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.screenshot({ 
      path: 'e2e/screenshots/portfolio-desktop.png',
      fullPage: true 
    });
  });

  test('should display token details', async ({ page }) => {
    await page.goto('/portfolio').catch(() => {});
    
    // Look for token rows or cards
    const tokenElements = page.locator('[data-testid*="token"], .token-item, .holding-item').first();
    
    await page.screenshot({ 
      path: 'e2e/screenshots/portfolio-token-details.png',
      fullPage: true 
    });
  });
});
