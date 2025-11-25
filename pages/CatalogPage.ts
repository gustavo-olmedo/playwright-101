import { Page, expect, Locator } from "@playwright/test";

export class CatalogPage {
  readonly root: Locator;
  readonly title: Locator;
  readonly list: Locator;

  constructor(public readonly page: Page) {
    this.root = page.getByTestId("catalog-page");
    this.title = page.getByTestId("catalog-title");
    this.list = page.getByTestId("catalog-list");
  }

  async expectLoaded() {
    await this.expectContainerAndTitle();
  }

  async expectContainerAndTitle() {
    await expect(this.root).toBeVisible();
    await expect(this.title).toBeVisible();
    await expect(this.title).toHaveText("Product Catalog");
  }

  private itemsLocator() {
    return this.list.locator('li[data-testid^="catalog-item-"]');
  }

  async getItemCount() {
    return await this.itemsLocator().count();
  }

  async expectListHasItems() {
    await expect(this.list).toBeVisible();
    const count = await this.getItemCount();
    expect(count).toBeGreaterThan(0);
  }

  itemRow(index: number) {
    return this.page.getByTestId(`catalog-item-${index}`);
  }

  itemName(index: number) {
    return this.page.getByTestId(`catalog-item-name-${index}`);
  }

  itemPriceLabel(index: number) {
    return this.page.getByTestId(`catalog-item-price-label-${index}`);
  }

  itemPriceValue(index: number) {
    return this.page.getByTestId(`catalog-item-price-value-${index}`);
  }

  itemQuantity(index: number) {
    return this.page.getByTestId(`catalog-item-quantity-${index}`);
  }

  addToCartButton(index: number) {
    return this.page.getByTestId(`catalog-item-add-button-${index}`);
  }

  async getItemQuantityNumber(index: number): Promise<number> {
    const text = (await this.itemQuantity(index).textContent()) || "0";
    const [num] = text.split(" ");
    return parseInt(num, 10);
  }

  async clickAddToCart(index: number) {
    await this.addToCartButton(index).click();
  }

  async expectItemBasicStructure(
    index: number,
    options?: { expectedButtonText?: string }
  ) {
    const { expectedButtonText } = options || {};

    await expect(this.itemName(index)).toBeVisible();
    await expect(this.itemPriceLabel(index)).toHaveText("Price: €");
    await expect(this.itemPriceValue(index)).toBeVisible();
    await expect(this.itemQuantity(index)).toContainText("units");
    await expect(this.addToCartButton(index)).toBeVisible();

    if (expectedButtonText) {
      await expect(this.addToCartButton(index)).toHaveText(expectedButtonText);
    }
  }

  async expectOutOfStock(index: number) {
    await expect(this.itemQuantity(index)).toHaveText("0 units");
    await expect(this.addToCartButton(index)).toBeDisabled();
    await expect(this.addToCartButton(index)).toHaveText("Out of Stock");
  }

  async expectInStock(index: number, expectedUnits: number) {
    await expect(this.itemQuantity(index)).toHaveText(`${expectedUnits} units`);
    await expect(this.addToCartButton(index)).toBeEnabled();
    await expect(this.addToCartButton(index)).toHaveText("Add to Cart");
  }

  async findItemIndexByName(name: string) {
    const items = this.itemsLocator();
    const count = await items.count();

    for (let i = 0; i < count; i++) {
      const text = await this.itemName(i).textContent();
      if (text?.trim() === name) return i;
    }
    return null;
  }
}
