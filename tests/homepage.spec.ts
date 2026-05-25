import { test, expect } from '@playwright/test';
import { FixedPage } from '../pages/fixed.page';
import { HomePage } from '../pages/home.page';

test.describe('Homepage', () => {
  let fixed: FixedPage;
  let homepage: HomePage;

  test.beforeEach(async ({ page }) => {
    fixed = new FixedPage(page);
    homepage = new HomePage(page);
    await page.goto('/');
  });

  test('Check navbar and sidebar is visible', async ({ page }) => {
    await fixed.checkNavbarVisible();
    await fixed.checkSidebarVisible();
  });
  
  test('Check banner', async ({ page }) => {
    await expect(page.locator('.img-fluid')).toBeVisible();
  });

  test('Check pagination', async ({ page }) => {
    await homepage.pagination.waitFor();
    if (await homepage.pagination.isVisible()) {
      await expect(homepage.product).toHaveCount(9);
    }
  });

  test('Price Range', async ({ page }) => {
    // Set price range from 30 to 80
    await fixed.setPriceRange(30, 80);

    // Retrieve all product prices (traversing pagination if present)
    const prices = await fixed.getAllProductPrices();
    console.log('Collected Product Prices (30-80 range):', prices);

    // Validate that all retrieved prices conform to the 30-80 range
    for (const price of prices) {
      expect(price).toBeGreaterThanOrEqual(30);
      expect(price).toBeLessThanOrEqual(80);
    }
  });

  test.describe('Sorting', () => {
    test('Check dropdown sort by product name ascending', async ({ page }) => {
      await fixed.sortByNameAsc();
    });
    
    test('Check dropdown sort by product name descending', async ({ page }) => {
      await fixed.sortByNameDesc();
    });
    
    test('Check dropdown sort by product price ascending', async ({ page }) => {
      await fixed.sortByPriceAsc();
    });
    
    test('Check dropdown sort by product price descending', async ({ page }) => {
      await fixed.sortByPriceDesc();
    });
    
    test('Check dropdown sort by product co2 ascending', async ({ page }) => {
      await fixed.sortByCo2Asc();
    });
    
    test('Check dropdown sort by product co2 descending', async ({ page }) => {
      await fixed.sortByCo2Desc();
    });
  });
  
});