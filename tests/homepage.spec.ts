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

  test('Check dropdown sort product', async ({ page }) => {
    await fixed.sortByNameAsc();
    await fixed.sortByNameDesc();
    await fixed.sortByPriceAsc();
    await fixed.sortByPriceDesc();
    await fixed.sortByCo2Asc();
    await fixed.sortByCo2Desc();
  });
  
  // test('Check price test', async ({ page }) => {
  //   await homepage.productName.first().waitFor();
  //   const titles = await homepage.productName.allTextContents();
  //     console.log(`hasil: ${titles}`);
  //     console.log('hasil:', titles);
  //     console.log(JSON.stringify(titles, null, 2));
  // });

  
});