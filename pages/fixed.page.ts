import { Page, Locator, expect } from '@playwright/test';
import { HomePage } from './home.page';

export class FixedPage {
  readonly page: Page;
  readonly documentation: Locator;
  readonly logo: Locator;
  readonly menuHome: Locator;
  readonly menuCategories: Locator;
  readonly menuContact: Locator;
  readonly menuSignIn: Locator;
  readonly menuLanguage: Locator;
  readonly sortProduct: Locator;
  readonly priceRange: Locator;
  readonly search: Locator;
  readonly homepage: HomePage;


  constructor(page: Page) {
    
    this.homepage = new HomePage(page);
    this.page = page;
    this.documentation = page.locator('a.text-white');
    this.logo = page.locator('.navbar-brand');
    this.menuHome = page.locator('.nav-item').getByText('Home');
    this.menuCategories = page.locator('.nav-item').getByText('Categories');
    this.menuContact = page.locator('.nav-item').getByText('Contact');
    this.menuSignIn = page.locator('.nav-item').getByText('Sign In');
    this.menuLanguage = page.locator('#language');
    this.sortProduct = page.locator('.form-select');
    this.priceRange = page.locator('.ngx-slider.animate');
    this.search = page.locator('#search-query');
  }

  async checkNavbarVisible() {
    await expect(this.logo).toBeVisible();
    await expect(this.menuHome).toBeVisible();
    await expect(this.menuCategories).toBeVisible();
    await expect(this.menuContact).toBeVisible();
    await expect(this.menuSignIn).toBeVisible();
    await expect(this.menuLanguage).toBeVisible();
  }

  async checkSidebarVisible() {
    await expect(this.sortProduct).toBeVisible();
    await expect(this.priceRange).toBeVisible();
    await expect(this.search).toBeVisible();
  }

  // private async sortProducts(option: 'name'|'price'|'co2_rating' , sortType: 'asc'|'desc') {
  //   await this.search.click();
  //   await this.search.selectOption(option);
  //   if (option === 'name') {
  //     const titles = await this.homepage..allTextContents();
  //     const sortedItems = [...titles].sort((a, b) =>
  //     sortType === 'asc' ? a.localeCompare(b) : b.localeCompare(a)
  //   );
  //   expect(titles).toEqual(sortedItems);
  //   } else {
  //     const prices = (await this.priceProduct.allTextContents())
  //     .map(p => Number(p.replace(/[^0-9.]/g, '')));
  //     const sortedItems = [...prices].sort((a, b) =>
  //       sortType === 'asc' ? a - b : b - a
  //     );
  //     expect(prices).toEqual(sortedItems);
  //   }
  // }

  // async sortByNameAsc() {
  //   await this.sortProducts('az', 'asc');
  // }

  async funcHomepage() {
    console.log(this.homepage.productPrice.first().textContent);
  }

}