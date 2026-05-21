import { Page, Locator, expect } from '@playwright/test';
import { HomePage } from './home.page';
import { title } from 'node:process';

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
    await this.page.waitForTimeout(6000);
    const allData = [];
    const allSortedItems = [];
    if (option === 'name') {
      // page1
      const titles1 = await this.homepage.productName.allTextContents();
      const sortedItems1 = [...titles1].sort((a, b) =>
        sortType === 'asc' ? a.localeCompare(b) : b.localeCompare(a)
      );
      allData.push(...titles1);
      allSortedItems.push(...sortedItems1);
      
      // check page2 exists
      const page2 = this.page.locator('[aria-label="Page-2"]');
      if (await page2.count() > 0) {
        await page2.click();
        await this.page.waitForTimeout(6000);
        const titles2 = await this.homepage.productName.allTextContents();
        const sortedItems2 = [...titles2].sort((a, b) =>
          sortType === 'asc' ? a.localeCompare(b) : b.localeCompare(a)
        );
        allData.push(...titles2);
        allSortedItems.push(...sortedItems2);
      }

      console.log('name',sortType, allData);
      expect(allData).toEqual(allSortedItems);

    } else if (option === 'price') {
      // page1
      const prices1 = (await this.homepage.productPrice.allTextContents())
        .map(p => Number(p.replace(/[^0-9.]/g, '')));
      const sortedItems1 = [...prices1].sort((a, b) =>
        sortType === 'asc' ? a - b : b - a
      );
      allData.push(...prices1);
      allSortedItems.push(...sortedItems1);

      // check page2 exists
      const page2 = this.page.locator('[aria-label="Page-2"]');
      if (await page2.count() > 0) {
        await page2.click();
        await this.page.waitForTimeout(6000);
        const prices2 = (await this.homepage.productPrice.allTextContents())
          .map(p => Number(p.replace(/[^0-9.]/g, '')));
        const sortedItems2 = [...prices2].sort((a, b) =>
          sortType === 'asc' ? a - b : b - a
        );
        allData.push(...prices2);
        allSortedItems.push(...sortedItems2);
      }

      console.log('price', sortType, allData);
      expect(allData).toEqual(allSortedItems);

    } else if (option === 'co2_rating') {
      // page1
      const ratings1 = await this.homepage.productCo2Rating.evaluateAll(elements =>
        elements.map(el => {
          const active = el.querySelector('.co2-letter.active');
          return active?.textContent?.trim() || '';
        })
      );
      const sortedItems1 = [...ratings1].sort((a, b) =>
        sortType === 'asc' ? a.localeCompare(b) : b.localeCompare(a)
      );
      allData.push(...ratings1);
      allSortedItems.push(...sortedItems1);

      // check page2 exists
      const page2 = this.page.locator('[aria-label="Page-2"]');
      if (await page2.count() > 0) {
        await page2.click();
        await this.page.waitForTimeout(6000);
        const ratings2 = await this.homepage.productCo2Rating.evaluateAll(elements =>
          elements.map(el => {
            const active = el.querySelector('.co2-letter.active');
            return active?.textContent?.trim() || '';
          })
        );
        const sortedItems2 = [...ratings2].sort((a, b) =>
          sortType === 'asc' ? a.localeCompare(b) : b.localeCompare(a)
        );
        allData.push(...ratings2);
        allSortedItems.push(...sortedItems2);
      }

      console.log('rating', sortType, allData);
      expect(allData).toEqual(allSortedItems);
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