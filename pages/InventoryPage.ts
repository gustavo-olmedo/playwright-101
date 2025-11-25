import { Page, expect, Locator } from "@playwright/test";

export class InventoryPage {
  readonly root: Locator;
  readonly title: Locator;
  readonly form: Locator;
  readonly nameInput: Locator;
  readonly priceInput: Locator;
  readonly quantityInput: Locator;
  readonly submitButton: Locator;
  readonly list: Locator;

  constructor(public readonly page: Page) {
    this.root = page.getByTestId("inventory-page");
    this.title = page.getByTestId("inventory-title");
    this.form = page.getByTestId("inventory-form");
    this.nameInput = page.getByTestId("inventory-input-name");
    this.priceInput = page.getByTestId("inventory-input-price");
    this.quantityInput = page.getByTestId("inventory-input-quantity");
    this.submitButton = page.getByTestId("inventory-submit-button");
    this.list = page.getByTestId("inventory-product-list");
  }

  async expectLoaded() {
    await this.expectContainerAndTitle();
  }

  async expectContainerAndTitle() {
    await expect(this.root).toBeVisible();
    await expect(this.title).toBeVisible();
    await expect(this.title).toHaveText("Inventory Management");
  }

  async expectFormWithInputs() {
    await expect(this.form).toBeVisible();

    await expect(this.nameInput).toBeVisible();
    await expect(this.priceInput).toBeVisible();
    await expect(this.quantityInput).toBeVisible();

    await expect(this.nameInput).toHaveAttribute("type", "text");
    await expect(this.priceInput).toHaveAttribute("type", "number");
    await expect(this.quantityInput).toHaveAttribute("type", "number");

    await expect(this.nameInput).toHaveAttribute("placeholder", "Product Name");
    await expect(this.priceInput).toHaveAttribute("placeholder", "Price (€)");
    await expect(this.quantityInput).toHaveAttribute("placeholder", "Quantity");
  }

  async expectSubmitButton(label: string = "Add Product") {
    await expect(this.submitButton).toBeVisible();
    await expect(this.submitButton).toHaveText(label);
  }

  async expectInitialProductListNotEmpty() {
    await expect(this.list).toBeVisible();
    const count = await this.getProductCount();
    expect(count).toBeGreaterThan(0);
  }

  private productsLocator() {
    return this.list.locator('li[data-testid^="inventory-product-"]');
  }

  async getProductCount() {
    return await this.productsLocator().count();
  }

  productRow(index: number) {
    return this.page.getByTestId(`inventory-product-${index}`);
  }

  productName(index: number) {
    return this.page.getByTestId(`inventory-product-name-${index}`);
  }

  productPriceLabel(index: number) {
    return this.page.getByTestId(`inventory-product-price-label-${index}`);
  }

  productPriceValue(index: number) {
    return this.page.getByTestId(`inventory-product-price-value-${index}`);
  }

  productQuantity(index: number) {
    return this.page.getByTestId(`inventory-product-quantity-${index}`);
  }

  increaseButton(index: number) {
    return this.page.getByTestId(`inventory-product-increase-${index}`);
  }

  decreaseButton(index: number) {
    return this.page.getByTestId(`inventory-product-decrease-${index}`);
  }

  async getProductQuantityNumber(index: number) {
    const text = await this.productQuantity(index).textContent();
    return parseInt(text || "0", 10);
  }

  async clickIncrease(index: number) {
    await this.increaseButton(index).click();
  }

  async clickDecrease(index: number) {
    await this.decreaseButton(index).click();
  }

  async fillProductForm(args: {
    name?: string;
    price?: string;
    quantity?: string;
  }) {
    const { name, price, quantity } = args;
    if (name !== undefined) {
      await this.nameInput.fill(name);
    }
    if (price !== undefined) {
      await this.priceInput.fill(price);
    }
    if (quantity !== undefined) {
      await this.quantityInput.fill(quantity);
    }
  }

  async clearForm() {
    await this.nameInput.fill("");
    await this.priceInput.fill("");
    await this.quantityInput.fill("");
  }

  async addProduct(name: string, price: string, quantity: string) {
    await this.fillProductForm({ name, price, quantity });
    await this.submitButton.click();
  }

  async submitExpectAlert(message: string, options?: { soft?: boolean }) {
    const { soft = false } = options || {};

    this.page.once("dialog", async (dialog) => {
      if (soft) {
        expect.soft(dialog.message()).toBe(message);
      } else {
        expect(dialog.message()).toBe(message);
      }
      await dialog.accept();
    });

    await this.submitButton.click();
  }

  async submitAndCaptureAlertMessage(): Promise<string> {
    let dialogMessage = "";

    this.page.once("dialog", async (dialog) => {
      dialogMessage = dialog.message();
      await dialog.accept();
    });

    await this.submitButton.click();

    return dialogMessage;
  }

  async setPriceInput(value: string) {
    await this.priceInput.fill(value);
  }

  async setQuantityInput(value: string) {
    await this.quantityInput.fill(value);
  }

  async expectPriceInputValue(value: string) {
    await expect(this.priceInput).toHaveValue(value);
  }

  async getQuantityInputRawValue() {
    return this.quantityInput.inputValue();
  }
}
