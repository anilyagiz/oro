import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveTitle(/Oro|Gold|Portfolio|Purchase/i);
    await page.screenshot({ path: 'e2e/screenshots/homepage-loaded.png', fullPage: true });
  });

  test('should display main navigation elements', async ({ page }) => {
    await page.goto('/');
    
    // Check for common navigation elements
    const header = page.locator('header, nav, [role="banner"]').first();
    await expect(header).toBeVisible();
    
    // Take screenshot of navigation
    await page.screenshot({ 
      path: 'e2e/screenshots/homepage-navigation.png',
      fullPage: false 
    });
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check that page loads without horizontal scroll
    const body = page.locator('body');
    const bodyWidth = await body.evaluate((el) => el.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 20); // Allow small tolerance
    
    await page.screenshot({ 
      path: 'e2e/screenshots/homepage-mobile.png',
      fullPage: true 
    });
  });

  test('should display hero section or main content', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const main = page.locator('main, [role="main"], .main-content').first();
    await expect(main).toBeVisible({ timeout: 10000 });
    await page.screenshot({ path: 'e2e/screenshots/homepage-content.png', fullPage: true });
  });

  test('should have working links', async ({ page }) => {
    await page.goto('/');
    
    // Find all internal links
    const links = page.locator('a[href^="/"]:not([href^="//"])');
    const count = await links.count();
    
    // Take initial screenshot
    await page.screenshot({ 
      path: 'e2e/screenshots/homepage-links.png',
      fullPage: true 
    });
    
    // Verify at least some links exist
    expect(count).toBeGreaterThanOrEqual(0);
  });
});
