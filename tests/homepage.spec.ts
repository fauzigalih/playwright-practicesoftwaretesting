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
    const paginationVisible = await homepage.pagination.isVisible();
    if (await homepage.pagination.isVisible()) {
      await expect(homepage.product).toHaveCount(9);
    }
  });

  test('Check price', async ({ page }) => {
    const price = await homepage.productPrice.nth(1).textContent();
    console.log(price);
  });
  test('Check price1', async ({ page }) => {
    await fixed.funcHomepage();
  });
  
});