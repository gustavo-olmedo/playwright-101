import { Page, expect, Locator } from "@playwright/test";

export class OrdersPage {
  readonly root: Locator;
  readonly title: Locator;
  readonly emptyMessage: Locator;
  readonly list: Locator;

  constructor(public readonly page: Page) {
    this.root = page.getByTestId("orders-page");
    this.title = page.getByTestId("orders-title");
    this.emptyMessage = page.getByTestId("orders-empty-message");
    this.list = page.getByTestId("orders-list");
  }

  async expectLoaded() {
    await expect(this.root).toBeVisible();
    await expect(this.title).toHaveText("Purchase Orders");
  }

  async expectEmpty(message: string = "No orders registered.") {
    await this.expectLoaded();
    await expect(this.emptyMessage).toBeVisible();
    await expect(this.emptyMessage).toHaveText(message);

    const listLocator = this.page.locator('[data-testid="orders-list"]');
    await expect(listLocator).toHaveCount(0);
  }

  async getOrderCount(): Promise<number> {
    return await this.list.locator('>li[data-testid^="order-"]').count();
  }

  orderContainer(index: number) {
    return this.page.getByTestId(`order-${index}`);
  }

  orderDate(index: number) {
    return this.page.getByTestId(`order-date-${index}`);
  }

  orderPayment(index: number) {
    return this.page.getByTestId(`order-payment-${index}`);
  }

  orderItemsContainer(index: number) {
    return this.page.getByTestId(`order-items-${index}`);
  }

  orderTotalLabel(index: number) {
    return this.page.getByTestId(`order-total-label-${index}`);
  }

  orderTotalValue(index: number) {
    return this.page.getByTestId(`order-total-value-${index}`);
  }

  async getOrderTotalNumber(index: number): Promise<number> {
    const txt = (await this.orderTotalValue(index).textContent()) || "0";
    return parseFloat(txt.trim());
  }

  async getOrderItemsCount(orderIndex: number): Promise<number> {
    return await this.orderItemsContainer(orderIndex).locator("li").count();
  }

  orderItemName(orderIndex: number, itemIndex: number) {
    return this.page.getByTestId(`order-item-name-${orderIndex}-${itemIndex}`);
  }

  orderItemTotalValue(orderIndex: number, itemIndex: number) {
    return this.page.getByTestId(
      `order-item-total-value-${orderIndex}-${itemIndex}`
    );
  }

  async getOrderItemTotalNumber(
    orderIndex: number,
    itemIndex: number
  ): Promise<number> {
    const txt =
      (await this.orderItemTotalValue(orderIndex, itemIndex).textContent()) ||
      "0";
    return parseFloat(txt.trim());
  }

  async expectOrderTotalsMatchItems(orderIndex: number) {
    const itemsCount = await this.getOrderItemsCount(orderIndex);
    let sum = 0;

    for (let j = 0; j < itemsCount; j++) {
      const itemTotal = await this.getOrderItemTotalNumber(orderIndex, j);
      sum += itemTotal;

      const nameText =
        (await this.orderItemName(orderIndex, j).textContent())?.trim() ?? "";
      expect(nameText).toMatch(/^\d+ x /);
    }

    const orderTotal = await this.getOrderTotalNumber(orderIndex);
    const expectedSum = parseFloat(sum.toFixed(2));
    expect(orderTotal).toBe(expectedSum);
  }

  async expectDateAndPaymentValid(
    orderIndex: number,
    allowedMethods: string[]
  ) {
    const dateText =
      (await this.orderDate(orderIndex).textContent())?.trim() ?? "";
    expect(dateText.startsWith("Date: ")).toBeTruthy();
    expect(dateText.includes(",")).toBeTruthy(); // "date, time"

    const paymentText =
      (await this.orderPayment(orderIndex).textContent())?.trim() ?? "";
    expect(paymentText.startsWith("Payment Method: ")).toBeTruthy();

    const method = paymentText.replace("Payment Method:", "").trim();
    expect(allowedMethods).toContain(method);
  }
}
