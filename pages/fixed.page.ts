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

  private async sortProducts(option: 'name'|'price'|'co2_rating' , sortType: 'asc'|'desc') {
    const value = `${option},${sortType}`;
    await this.sortProduct.click();
    await this.sortProduct.selectOption(value);
    await this.page.waitForTimeout(3000);
    if (option === 'name') {
      const titles = await this.homepage.productName.allTextContents();
      const sortedItems = [...titles].sort((a, b) =>
        sortType === 'asc' ? a.localeCompare(b) : b.localeCompare(a)
      );
      expect(titles).toEqual(sortedItems);
      console.log('name',sortType, titles);
    } else if (option === 'price') {
      const prices = (await this.homepage.productPrice.allTextContents())
        .map(p => Number(p.replace(/[^0-9.]/g, '')));
      const sortedItems = [...prices].sort((a, b) =>
        sortType === 'asc' ? a - b : b - a
      );
      expect(prices).toEqual(sortedItems);
      console.log('price', sortType, prices);
    } else if (option === 'co2_rating') {
      const ratings = await this.homepage.productCo2Rating.evaluateAll(elements =>
        elements.map(el => {
          const active = el.querySelector('.co2-letter.active');

          return active?.textContent?.trim() || '';
        })
      );
      const sortedItems = [...ratings].sort((a, b) =>
        sortType === 'asc'
          ? a.localeCompare(b)
          : b.localeCompare(a)
      );
      expect(ratings).toEqual(sortedItems);
      console.log('rating', sortType, ratings);
    }
  }

  async sortByNameAsc() {
    await this.sortProducts('name', 'asc');
  }

  async sortByNameDesc() {
    await this.sortProducts('name', 'desc');
  }

  async sortByPriceAsc() {
    await this.sortProducts('price', 'asc');
  }
  
  async sortByPriceDesc() {
    await this.sortProducts('price', 'desc');
  }

  async sortByCo2Asc() {
    await this.sortProducts('co2_rating', 'asc');
  }
  
  async sortByCo2Desc() {
    await this.sortProducts('co2_rating', 'desc');
  }

}