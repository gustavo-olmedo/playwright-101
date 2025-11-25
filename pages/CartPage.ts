import { Page, expect, Locator } from "@playwright/test";

export class CartPage {
  readonly root: Locator;
  readonly title: Locator;
  readonly emptyMessage: Locator;
  readonly list: Locator;
  readonly summary: Locator;
  readonly totalLabel: Locator;
  readonly totalValue: Locator;
  readonly goToPaymentButton: Locator;

  constructor(public readonly page: Page) {
    this.root = page.getByTestId("cart-page");
    this.title = page.getByTestId("cart-title");
    this.emptyMessage = page.getByTestId("cart-empty-message");
    this.list = page.getByTestId("cart-list");
    this.summary = page.getByTestId("cart-summary");
    this.totalLabel = page.getByTestId("cart-total-label");
    this.totalValue = page.getByTestId("cart-total-value");
    this.goToPaymentButton = page.getByTestId("cart-go-to-payment");
  }

  async expectLoaded() {
    await expect(this.root).toBeVisible();
    await expect(this.title).toHaveText("Your Cart");
  }

  async expectEmpty(message: string = "Your cart is empty.") {
    await expect(this.title).toHaveText("Your Cart");
    await expect(this.emptyMessage).toBeVisible();
    await expect(this.emptyMessage).toHaveText(message);

    await expect(this.list).toHaveCount(0);
    await expect(this.summary).toHaveCount(0);
  }

  async expectNotEmpty() {
    await expect(this.emptyMessage).toHaveCount(0);
    await expect(this.list).toBeVisible();
    await expect(this.summary).toBeVisible();
    await expect(this.totalLabel).toHaveText("Total: €");
    await expect(this.totalValue).toBeVisible();
  }

  private itemsLocator() {
    return this.list.locator('li[data-testid^="cart-item-"]');
  }

  async getItemCount() {
    return await this.itemsLocator().count();
  }

  itemName(index: number) {
    return this.page.getByTestId(`cart-item-name-${index}`);
  }

  itemQuantity(index: number) {
    return this.page.getByTestId(`cart-item-quantity-${index}`);
  }

  itemPriceValue(index: number) {
    return this.page.getByTestId(`cart-item-price-value-${index}`);
  }

  itemRowTotalValue(index: number) {
    return this.page.getByTestId(`cart-item-total-value-${index}`);
  }

  async getItemQuantityNumber(index: number): Promise<number> {
    const txt = (await this.itemQuantity(index).textContent()) || "0";
    return parseFloat(txt.trim());
  }

  async getItemPriceNumber(index: number): Promise<number> {
    const txt = (await this.itemPriceValue(index).textContent()) || "0";
    return parseFloat(txt.trim());
  }

  async getItemRowTotalNumber(index: number): Promise<number> {
    const txt = (await this.itemRowTotalValue(index).textContent()) || "0";
    return parseFloat(txt.trim());
  }

  async getCartTotalNumber(): Promise<number> {
    const txt = (await this.totalValue.textContent()) || "0";
    return parseFloat(txt.trim());
  }

  async findItemIndexByName(name: string): Promise<number | null> {
    const items = this.itemsLocator();
    const count = await items.count();

    for (let i = 0; i < count; i++) {
      const text = (await this.itemName(i).textContent())?.trim();
      if (text === name) return i;
    }
    return null;
  }

  async goToPaymentsAndWait() {
    await expect(this.goToPaymentButton).toBeVisible();
    await this.goToPaymentButton.click();
    await expect(this.page.getByTestId("payment-page")).toBeVisible();
  }
}
