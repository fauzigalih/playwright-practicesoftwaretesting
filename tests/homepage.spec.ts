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

  test.describe('Feature Search', () => {
    const KEYWORD = 'hammer';

    test('Search Product', async ({ page }) => {
      await fixed.searchProduct(KEYWORD);

      // Validate "Searched for: <keyword>" matches input
      const searchKeyword = await fixed.getSearchResultKeyword();
      expect(searchKeyword.toLowerCase()).toBe(KEYWORD);

      // Validate total count and keyword in count message
      const total = await fixed.getSearchResultTotal();
      const countKeyword = await fixed.getSearchResultKeywordFromCount();
      expect(total).toBeGreaterThan(0);
      expect(countKeyword.toLowerCase()).toBe(KEYWORD);

      // Validate total matches actual number of displayed products
      const productNames = await fixed.getSearchResultProductNames();
      expect(productNames.length).toBe(total);

      // List the products found
      console.log(`Found ${total} products for keyword "${KEYWORD}":`, productNames);
    });

    test('Clear Filter Search', async ({ page }) => {
      // Search for keyword first
      await fixed.searchProduct(KEYWORD);

      // Verify search results are displayed
      await expect(fixed.searchResultHeading).toBeVisible();
      await expect(fixed.searchResultCount).toBeVisible();

      // Ensure products exist
      const productsBeforeClear = await fixed.getSearchResultProductNames();
      expect(productsBeforeClear.length).toBeGreaterThan(0);

      // Click X to clear search
      await fixed.clearSearch();

      // Validate "Searched for:" text no longer appears
      await expect(fixed.searchResultHeading).not.toBeVisible();

      // Validate count text no longer appears
      await expect(fixed.searchResultCount).not.toBeVisible();

      // Validate there are other products besides hammer
      const nonHammerProducts = await fixed.getNonMatchingProductNames(KEYWORD);
      expect(nonHammerProducts.length).toBeGreaterThan(0);
      console.log('Non-hammer products after clear:', nonHammerProducts);
    });
  });

});