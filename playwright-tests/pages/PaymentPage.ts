import { Page, expect, Locator } from "@playwright/test";

export class PaymentPage {
  readonly root: Locator;
  readonly title: Locator;
  readonly emptyMessage: Locator;
  readonly list: Locator;
  readonly summary: Locator;
  readonly totalLabel: Locator;
  readonly totalValue: Locator;
  readonly methodsSection: Locator;
  readonly methodsLabel: Locator;
  readonly confirmButton: Locator;

  constructor(public readonly page: Page) {
    this.root = page.getByTestId("payment-page");
    this.title = page.getByTestId("payment-title");
    this.emptyMessage = page.getByTestId("payment-empty-message");
    this.list = page.getByTestId("payment-cart-list");
    this.summary = page.getByTestId("payment-summary");
    this.totalLabel = page.getByTestId("payment-total-label");
    this.totalValue = page.getByTestId("payment-total-value");
    this.methodsSection = page.getByTestId("payment-methods-section");
    this.methodsLabel = page.getByTestId("payment-methods-label");
    this.confirmButton = page.getByTestId("payment-confirm-button");
  }

  async expectLoaded() {
    await expect(this.root).toBeVisible();
    await expect(this.title).toHaveText("Payment");
  }

  async expectEmpty(message: string = "No items to pay.") {
    await expect(this.title).toHaveText("Payment");
    await expect(this.emptyMessage).toBeVisible();
    await expect(this.emptyMessage).toHaveText(message);

    await expect(this.list).toHaveCount(0);
    await expect(this.summary).toHaveCount(0);
    await expect(this.methodsSection).toHaveCount(0);
    await expect(this.confirmButton).toHaveCount(0);
  }

  async expectHasItemsAndSummary() {
    await expect(this.list).toBeVisible();

    const count = await this.getItemCount();
    expect(count).toBeGreaterThan(0);

    await expect(this.summary).toBeVisible();
    await expect(this.totalLabel).toHaveText("Total: €");
    await expect(this.totalValue).toBeVisible();
  }

  private itemsLocator() {
    return this.list.locator('[data-testid^="payment-cart-item-"]');
  }

  async getItemCount() {
    return await this.itemsLocator().count();
  }

  itemName(index: number) {
    return this.page.getByTestId(`payment-item-name-${index}`);
  }

  itemQuantity(index: number) {
    return this.page.getByTestId(`payment-item-quantity-${index}`);
  }

  itemPriceCurrency(index: number) {
    return this.page.getByTestId(`payment-item-price-currency-${index}`);
  }

  itemPriceValue(index: number) {
    return this.page.getByTestId(`payment-item-price-value-${index}`);
  }

  itemTotalCurrency(index: number) {
    return this.page.getByTestId(`payment-item-total-currency-${index}`);
  }

  itemTotalValue(index: number) {
    return this.page.getByTestId(`payment-item-total-value-${index}`);
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
    const txt = (await this.itemTotalValue(index).textContent()) || "0";
    return parseFloat(txt.trim());
  }

  async getPaymentTotalNumber(): Promise<number> {
    const txt = (await this.totalValue.textContent()) || "0";
    return parseFloat(txt.trim());
  }

  async expectItemStructure(index: number) {
    await expect(this.itemName(index)).toBeVisible();
    await expect(this.itemQuantity(index)).toBeVisible();
    await expect(this.itemPriceCurrency(index)).toHaveText("€");
    await expect(this.itemPriceValue(index)).toBeVisible();
    await expect(this.itemTotalCurrency(index)).toHaveText("€");
    await expect(this.itemTotalValue(index)).toBeVisible();
  }

  paymentMethodWrapper(id: string) {
    return this.page.getByTestId(`payment-method-${id}`);
  }

  paymentMethodInput(id: string) {
    return this.page.getByTestId(`payment-method-input-${id}`);
  }

  paymentMethodLabel(id: string) {
    return this.page.getByTestId(`payment-method-label-${id}`);
  }

  async expectMethodsUnselected(methodIds: string[]) {
    await expect(this.methodsSection).toBeVisible();
    await expect(this.methodsLabel).toHaveText("Payment Method:");

    for (const id of methodIds) {
      const wrapper = this.paymentMethodWrapper(id);
      const input = this.paymentMethodInput(id);
      const label = this.paymentMethodLabel(id);

      await expect(wrapper).toBeVisible();
      await expect(input).toBeVisible();
      await expect(label).toBeVisible();
      await expect(label).toHaveText(id);
      await expect(input).not.toBeChecked();
    }
  }

  async selectMethod(id: string) {
    const input = this.paymentMethodInput(id);
    await expect(input).toBeVisible();
    await expect(input).not.toBeChecked();
    await input.check();
    await expect(input).toBeChecked();
  }

  async confirmWithoutMethodExpectAlert(
    message: string,
    options?: { soft?: boolean }
  ) {
    const { soft = false } = options || {};

    this.page.once("dialog", async (dialog) => {
      if (soft) {
        expect.soft(dialog.message()).toBe(message);
      } else {
        expect(dialog.message()).toBe(message);
      }
      await dialog.accept();
    });

    await this.confirmButton.click();
  }

  async confirmPayment() {
    await this.confirmButton.click();
  }
}
