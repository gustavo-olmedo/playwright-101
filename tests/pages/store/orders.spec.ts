import { test, expect, Page } from "@playwright/test";

async function openOrdersPage(page: Page) {
  await page.goto("/store");
  await page.getByTestId("store-tab-orders").click();
  await expect(page.getByTestId("orders-page")).toBeVisible();
}

async function openCatalogTab(page: Page) {
  await page.getByTestId("store-tab-catalog").click();
  await expect(page.getByTestId("catalog-page")).toBeVisible();
}

async function addToCartFromCatalog(
  page: Page,
  productName: string,
  times = 1
) {
  const list = page.getByTestId("catalog-list");
  const items = list.locator('[data-testid^="catalog-item-"]');
  const count = await items.count();

  let targetIndex: number | null = null;

  for (let i = 0; i < count; i++) {
    const nameLocator = page.getByTestId(`catalog-item-name-${i}`);
    const nameText = (await nameLocator.textContent())?.trim();
    if (nameText === productName) {
      targetIndex = i;
      break;
    }
  }

  expect(targetIndex).not.toBeNull();
  const index = targetIndex as number;

  const button = page.getByTestId(`catalog-item-add-button-${index}`);

  for (let t = 0; t < times; t++) {
    await expect(button).toBeEnabled();
    await button.click();
  }
}

async function openCartTab(page: Page) {
  await page.getByTestId("store-tab-cart").click();
  await expect(page.getByTestId("cart-page")).toBeVisible();
}

async function createSingleOrderViaUi(page: Page, paymentMethodId = "Visa") {
  // 1) Go to Catalog and add an item to cart
  await openCatalogTab(page);
  await addToCartFromCatalog(page, "Giant Rubber Duck", 1);

  // 2) Go to Cart and then to Payment
  await openCartTab(page);
  const goToPaymentButton = page.getByTestId("cart-go-to-payment");
  await expect(goToPaymentButton).toBeVisible();
  await goToPaymentButton.click();
  await expect(page.getByTestId("payment-page")).toBeVisible();

  const methodInput = page.getByTestId(
    `payment-method-input-${paymentMethodId}`
  );
  await methodInput.check();
  await expect(methodInput).toBeChecked();

  const confirmButton = page.getByTestId("payment-confirm-button");
  await confirmButton.click();
  await expect(page.getByTestId("orders-page")).toBeVisible();
}

async function createSingleOrder(page: Page, paymentMethodId = "Visa") {
  // 1) Go to Catalog and add an item to cart
  await openCatalogTab(page);
  await addToCartFromCatalog(page, "Giant Rubber Duck", 1);

  await openCartTab(page);
  const goToPaymentButton = page.getByTestId("cart-go-to-payment");
  await expect(goToPaymentButton).toBeVisible();
  await goToPaymentButton.click();
  await expect(page.getByTestId("payment-page")).toBeVisible();

  const methodInput = page.getByTestId(
    `payment-method-input-${paymentMethodId}`
  );
  await methodInput.check();
  await expect(methodInput).toBeChecked();

  const confirmButton = page.getByTestId("payment-confirm-button");
  await confirmButton.click();

  await expect(page.getByTestId("orders-page")).toBeVisible();
}

test.describe("Store - Orders", () => {
  test.beforeEach(async ({ page }) => {
    await openOrdersPage(page);
  });

  test("orders shows empty message when there are no orders", async ({
    page,
  }) => {
    await openOrdersPage(page);

    await expect(page.getByTestId("orders-title")).toHaveText(
      "Purchase Orders"
    );
    await expect(page.getByTestId("orders-empty-message")).toBeVisible();
    await expect(page.getByTestId("orders-empty-message")).toHaveText(
      "No orders registered."
    );

    await expect(page.locator('[data-testid="orders-list"]')).toHaveCount(0);
  });

  test("renders orders layout and list when there is at least one order", async ({
    page,
  }) => {
    await createSingleOrder(page);

    await test.step("shows orders container and title", async () => {
      await expect(page.getByTestId("orders-page")).toBeVisible();
      const title = page.getByTestId("orders-title");
      await expect(title).toBeVisible();
      await expect(title).toHaveText("Purchase Orders");
    });

    await test.step("shows orders list with at least one order", async () => {
      const list = page.getByTestId("orders-list");
      await expect(list).toBeVisible();

      const orders = list.locator('[data-testid^="order-"]');
      const count = await orders.count();
      expect(count).toBeGreaterThan(0);
    });

    await test.step("checks structure of first order", async () => {
      const index = 0;

      const date = page.getByTestId(`order-date-${index}`);
      const payment = page.getByTestId(`order-payment-${index}`);
      const itemsList = page.getByTestId(`order-items-${index}`);
      const totalLabel = page.getByTestId(`order-total-label-${index}`);
      const totalValue = page.getByTestId(`order-total-value-${index}`);

      await expect(date).toBeVisible();
      const dateText = (await date.textContent()) ?? "";
      expect(dateText.startsWith("Date: ")).toBeTruthy();

      await expect(payment).toBeVisible();
      const paymentText = (await payment.textContent()) ?? "";
      expect(paymentText.startsWith("Payment Method: ")).toBeTruthy();

      await expect(itemsList).toBeVisible();
      const orderItems = itemsList.locator('[data-testid^="order-item-"]');
      expect(await orderItems.count()).toBeGreaterThan(0);

      await expect(totalLabel).toHaveText("Total: €");
      await expect(totalValue).toBeVisible();
    });
  });

  test("each order total equals sum of its item totals", async ({ page }) => {
    await createSingleOrder(page);
    const ordersList = page.getByTestId("orders-list");
    const orders = ordersList.locator('>li[data-testid^="order-"]');
    const orderCount = await orders.count();
    for (let i = 0; i < orderCount; i++) {
      await test.step(`validates total for order ${i}`, async () => {
        const itemsList = page.getByTestId(`order-items-${i}`);
        const orderItems = itemsList.locator(`li`);
        const itemCount = await orderItems.count();
        let sum = 0;
        for (let j = 0; j < itemCount; j++) {
          const itemTotalText = await page
            .getByTestId(`order-item-total-value-${i}-${j}`)
            .textContent();
          const itemTotal = parseFloat((itemTotalText || "0").trim());
          sum += itemTotal;
          const nameText =
            (
              await page.getByTestId(`order-item-name-${i}-${j}`).textContent()
            )?.trim() ?? "";
          expect(nameText).toMatch(/^\d+ x /);
        }
        const orderTotalText = await page
          .getByTestId(`order-total-value-${i}`)
          .textContent();
        const orderTotal = parseFloat((orderTotalText || "0").trim());
        const expectedSum = parseFloat(sum.toFixed(2));
        expect(orderTotal).toBe(expectedSum);
      });
    }
  });
});
