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
  readonly priceMinHandle: Locator;
  readonly priceMaxHandle: Locator;
  readonly search: Locator;
  readonly searchClearButton: Locator;
  readonly searchButton: Locator;
  readonly searchResultHeading: Locator;
  readonly searchResultCount: Locator;
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
    this.priceMinHandle = page.locator('span.ngx-slider-pointer-min');
    this.priceMaxHandle = page.locator('span.ngx-slider-pointer-max');
    this.search = page.locator('#search-query');
    this.searchClearButton = page.getByRole('button', { name: 'X' });
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.searchResultHeading = page.locator('h3').filter({ hasText: 'Searched for:' });
    this.searchResultCount = page.locator('p').filter({ hasText: 'products found for' });
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

  /**
   * Helper method to extract actual values from the current page based on the sort option.
   */
  private async getProductValues(option: 'name' | 'price' | 'co2_rating'): Promise<(string | number)[]> {
    if (option === 'name') {
      return await this.homepage.productName.allTextContents();
    } else if (option === 'price') {
      const texts = await this.homepage.productPrice.allTextContents();
      return texts.map(p => Number(p.replace(/[^0-9.]/g, '')));
    } else if (option === 'co2_rating') {
      return await this.homepage.productCo2Rating.evaluateAll(elements =>
        elements.map(el => {
          const active = el.querySelector('.co2-letter.active');
          return active?.textContent?.trim() || '';
        })
      );
    }
    return [];
  }

  /**
   * Universal compare function for sorting values.
   */
  private compareValues(a: string | number, b: string | number, sortType: 'asc' | 'desc'): number {
    if (typeof a === 'number' && typeof b === 'number') {
      return sortType === 'asc' ? a - b : b - a;
    }
    return sortType === 'asc' ? String(a).localeCompare(String(b)) : String(b).localeCompare(String(a));
  }

  /**
   * Common sorting and assertion pipeline for products across page 1 and page 2.
   */
  private async sortProducts(option: 'name' | 'price' | 'co2_rating', sortType: 'asc' | 'desc') {
    const value = `${option},${sortType}`;
    await this.sortProduct.click();
    await this.sortProduct.selectOption(value);
    await this.page.waitForTimeout(6000);

    const allData: (string | number)[] = [];
    const allSortedItems: (string | number)[] = [];

    // Process Page 1
    const page1Data = await this.getProductValues(option);
    const page1Sorted = [...page1Data].sort((a, b) => this.compareValues(a, b, sortType));
    allData.push(...page1Data);
    allSortedItems.push(...page1Sorted);

    // Process Page 2 if exists
    const page2 = this.page.locator('[aria-label="Page-2"]');
    if (await page2.count() > 0) {
      await page2.click();
      await this.page.waitForTimeout(6000);
      
      const page2Data = await this.getProductValues(option);
      const page2Sorted = [...page2Data].sort((a, b) => this.compareValues(a, b, sortType));
      allData.push(...page2Data);
      allSortedItems.push(...page2Sorted);
    }

    console.log(`${option} (${sortType}):`, allData);
    expect(allData).toEqual(allSortedItems);
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

  async setPriceRange(minTarget: number, maxTarget: number) {
    // Setup response promise before triggering filter changes
    const responsePromise = this.page.waitForResponse(response => 
      response.url().includes('products') && 
      response.url().includes(`between=price,${minTarget},${maxTarget}`) && 
      response.status() === 200
    );

    // Adjust Min
    await this.priceMinHandle.focus();
    let currentMin = Number(await this.priceMinHandle.getAttribute('aria-valuenow'));
    while (currentMin !== minTarget) {
      if (currentMin < minTarget) {
        await this.page.keyboard.press('ArrowRight');
      } else {
        await this.page.keyboard.press('ArrowLeft');
      }
      await this.page.waitForTimeout(50);
      currentMin = Number(await this.priceMinHandle.getAttribute('aria-valuenow'));
    }

    // Adjust Max
    await this.priceMaxHandle.focus();
    let currentMax = Number(await this.priceMaxHandle.getAttribute('aria-valuenow'));
    while (currentMax !== maxTarget) {
      if (currentMax < maxTarget) {
        await this.page.keyboard.press('ArrowRight');
      } else {
        await this.page.keyboard.press('ArrowLeft');
      }
      await this.page.waitForTimeout(50);
      currentMax = Number(await this.priceMaxHandle.getAttribute('aria-valuenow'));
    }

    // Wait for the specific API response that matches the target filter
    await responsePromise;
    
    // Add additional short timeout for DOM/UI updates
    await this.page.waitForTimeout(3000);
  }

  async getAllProductPrices(): Promise<number[]> {
    const allPrices: number[] = [];

    // Extract from current page (Page 1)
    const page1Texts = await this.homepage.productPrice.allTextContents();
    allPrices.push(...page1Texts.map(p => Number(p.replace(/[^0-9.]/g, ''))));

    // Check pagination & traverse pages
    const pagination = this.page.locator('.pagination');
    if (await pagination.isVisible()) {
      let pageNum = 2;
      while (true) {
        const pageLink = this.page.locator(`[aria-label="Page-${pageNum}"]`);
        if (await pageLink.count() > 0) {
          const pageResponsePromise = this.page.waitForResponse(response =>
            response.url().includes('products') && 
            response.url().includes(`page=${pageNum}`) && 
            response.status() === 200
          );
          await pageLink.click();
          await pageResponsePromise;
          await this.page.waitForTimeout(3000);

          const pageTexts = await this.homepage.productPrice.allTextContents();
          allPrices.push(...pageTexts.map(p => Number(p.replace(/[^0-9.]/g, ''))));
          pageNum++;
        } else {
          break;
        }
      }
    }

    return allPrices;
  }

  // ==============================
  // SEARCH METHODS
  // ==============================

  /**
   * Type a keyword into the search box and press Enter to trigger search.
   */
  async searchProduct(keyword: string) {
    await this.search.fill(keyword);
    await this.page.keyboard.press('Enter');
    await this.page.waitForTimeout(3000);
  }

  /**
   * Get the keyword displayed in the "Searched for: <keyword>" heading.
   * Returns the keyword portion only.
   */
  async getSearchResultKeyword(): Promise<string> {
    const text = await this.searchResultHeading.textContent();
    return text?.replace('Searched for:', '').trim() ?? '';
  }

  /**
   * Get the total number from "<total> products found for '<keyword>'".
   * Returns total as a number.
   */
  async getSearchResultTotal(): Promise<number> {
    const text = await this.searchResultCount.textContent() ?? '';
    const match = text.match(/(\d+)\s+products found for/);
    return match ? parseInt(match[1], 10) : 0;
  }

  /**
   * Get the keyword portion from "<total> products found for '<keyword>'".
   */
  async getSearchResultKeywordFromCount(): Promise<string> {
    const text = await this.searchResultCount.textContent() ?? '';
    const match = text.match(/products found for '(.+)'/);
    return match ? match[1] : '';
  }

  /**
   * Get the list of product names displayed in search results.
   */
  async getSearchResultProductNames(): Promise<string[]> {
    return await this.homepage.productName.allTextContents();
  }

  /**
   * Click the X button to clear the search filter.
   */
  async clearSearch() {
    await this.searchClearButton.click();
    await this.page.waitForTimeout(2000);
  }

  /**
   * Check if the search result heading "Searched for: ..." is visible.
   */
  async isSearchResultVisible(): Promise<boolean> {
    return await this.searchResultHeading.isVisible();
  }

  /**
   * Check if the search result count text is visible.
   */
  async isSearchResultCountVisible(): Promise<boolean> {
    return await this.searchResultCount.isVisible();
  }

  /**
   * Get all product names that do NOT contain the given keyword.
   */
  async getNonMatchingProductNames(keyword: string): Promise<string[]> {
    const allNames = await this.getSearchResultProductNames();
    return allNames.filter(name => !name.toLowerCase().includes(keyword.toLowerCase()));
  }
}