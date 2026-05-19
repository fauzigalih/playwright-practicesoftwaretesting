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
    await homepage.checkPaginationVisible();
    await expect(homepage.product).toHaveCount(11);
  });
  
});