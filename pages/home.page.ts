import { Page, Locator, expect } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly banner: Locator;
  readonly product: Locator;
  readonly pagination: Locator;

  constructor(page: Page) {
    this.page = page;
    this.banner = page.locator('.img-fluid');
    this.product = page.locator('div.card-img-wrapper');
    this.pagination = page.locator('.pagination');
  }

  async checkPaginationVisible() {
    const paginationVisible = await this.pagination.isVisible();

    if (paginationVisible) {
      await expect(this.product).toHaveCount(11);
    }
  }

}