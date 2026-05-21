import { Page, Locator, expect } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly banner: Locator;
  readonly product: Locator;
  readonly pagination: Locator;
  readonly productName: Locator;
  readonly productPrice: Locator;
  readonly productCo2Rating: Locator;

  constructor(page: Page) {
    this.page = page;
    this.banner = page.locator('.img-fluid');
    this.product = page.locator('div.card-img-wrapper');
    this.pagination = page.locator('.pagination');
    this.productName = page.getByTestId('product-name');
    this.productPrice = page.getByTestId('product-price');
    this.productCo2Rating = page.getByTestId('co2-rating-badge');
  }
  
}