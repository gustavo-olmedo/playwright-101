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

async function createSingleOrder(page: Page, paymentMethodId = "Visa") {
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

  test("each order has a valid date line and known payment method", async ({
    page,
  }) => {
    await createSingleOrder(page);

    const ordersList = page.getByTestId("orders-list");
    const orders = ordersList.locator('>li[data-testid^="order-"]');
    const orderCount = await orders.count();

    const allowedMethods = ["MBWay", "Klarna", "Multibanco", "PayPal", "Visa"];

    for (let i = 0; i < orderCount; i++) {
      await test.step(`checks date & payment method for order ${i}`, async () => {
        const dateText =
          (await page.getByTestId(`order-date-${i}`).textContent())?.trim() ??
          "";
        expect(dateText.startsWith("Date: ")).toBeTruthy();
        expect(dateText.includes(",")).toBeTruthy(); // rough check "date, time"

        const paymentText =
          (
            await page.getByTestId(`order-payment-${i}`).textContent()
          )?.trim() ?? "";

        expect(paymentText.startsWith("Payment Method: ")).toBeTruthy();
        const method = paymentText.replace("Payment Method:", "").trim();
        expect(allowedMethods).toContain(method);
      });
    }
  });

  test("confirming a payment creates a new order with same items, total and payment method", async ({
    page,
  }) => {
    // Snapshot current number of orders, we start from Orders page
    const initialOrdersList = page.getByTestId("orders-list");
    const initialOrders = initialOrdersList.locator(
      '>li[data-testid^="order-"]'
    );
    const initialOrderCount = await initialOrders.count();

    let paymentSnapshot: {
      method: string;
      items: { name: string; quantity: number; total: number }[];
      total: number;
    };

    await test.step("build cart and capture payment snapshot", async () => {
      await openCatalogTab(page);
      await addToCartFromCatalog(page, "Giant Rubber Duck", 1);
      await addToCartFromCatalog(page, "Bacon-Scented Candle", 2);

      await openCartTab(page);

      const goToPaymentButton = page.getByTestId("cart-go-to-payment");
      await expect(goToPaymentButton).toBeVisible();
      await goToPaymentButton.click();
      await expect(page.getByTestId("payment-page")).toBeVisible();

      const selectedMethodId = "Visa";

      const methodInput = page.getByTestId(
        `payment-method-input-${selectedMethodId}`
      );
      await methodInput.check();
      await expect(methodInput).toBeChecked();

      const itemsList = page.getByTestId("payment-cart-list");
      const paymentItems = itemsList.locator(
        '[data-testid^="payment-cart-item-"]'
      );
      const paymentItemCount = await paymentItems.count();

      const snapshot: {
        method: string;
        items: { name: string; quantity: number; total: number }[];
        total: number;
      } = {
        method: selectedMethodId,
        items: [],
        total: 0,
      };

      let sum = 0;

      for (let i = 0; i < paymentItemCount; i++) {
        const nameText =
          (
            await page.getByTestId(`payment-item-name-${i}`).textContent()
          )?.trim() ?? "";
        const quantityText = await page
          .getByTestId(`payment-item-quantity-${i}`)
          .textContent();
        const totalText = await page
          .getByTestId(`payment-item-total-value-${i}`)
          .textContent();

        const quantity = parseFloat((quantityText || "0").trim());
        const total = parseFloat((totalText || "0").trim());

        snapshot.items.push({ name: nameText, quantity, total });
        sum += total;
      }

      const paymentTotalText = await page
        .getByTestId("payment-total-value")
        .textContent();
      const paymentTotal = parseFloat((paymentTotalText || "0").trim());
      expect(paymentTotal).toBe(parseFloat(sum.toFixed(2)));

      snapshot.total = paymentTotal;
      paymentSnapshot = snapshot;

      const confirmButton = page.getByTestId("payment-confirm-button");
      await confirmButton.click();
      await expect(page.getByTestId("orders-page")).toBeVisible();
    });

    // I need to verify orders increased and a matching order exists
    await test.step("find a new order matching payment snapshot", async () => {
      const ordersList = page.getByTestId("orders-list");
      const orders = ordersList.locator('>li[data-testid^="order-"]');
      const orderCount = await orders.count();

      expect(orderCount).toBe(initialOrderCount + 1);

      let matchingOrderIndex: number | null = null;

      for (let i = 0; i < orderCount; i++) {
        const paymentText =
          (
            await page.getByTestId(`order-payment-${i}`).textContent()
          )?.trim() ?? "";
        const method = paymentText.replace("Payment Method:", "").trim();

        const totalText = await page
          .getByTestId(`order-total-value-${i}`)
          .textContent();
        const orderTotal = parseFloat((totalText || "0").trim());

        if (
          method === paymentSnapshot.method &&
          orderTotal === paymentSnapshot.total
        ) {
          matchingOrderIndex = i;
          break;
        }
      }

      expect(matchingOrderIndex).not.toBeNull();
      const orderIndex = matchingOrderIndex as number;

      // compare items with payment snapshot, I'm using the index :-)
      const itemsList = page.getByTestId(`order-items-${orderIndex}`);
      const orderItems = itemsList.locator(
        `[data-testid^="order-item-${orderIndex}-"]`
      );
      const orderItemCount = await orderItems.count();

      expect(orderItemCount).toBe(paymentSnapshot.items.length);

      for (let j = 0; j < orderItemCount; j++) {
        const snapItem = paymentSnapshot.items[j];

        const orderItemNameText =
          (
            await page
              .getByTestId(`order-item-name-${orderIndex}-${j}`)
              .textContent()
          )?.trim() ?? "";
        const orderItemTotalText = await page
          .getByTestId(`order-item-total-value-${orderIndex}-${j}`)
          .textContent();

        const orderItemTotal = parseFloat((orderItemTotalText || "0").trim());

        // Expected format just like the html "<quantity> x <name>" altoque roque
        const expectedName = `${snapItem.quantity} x ${snapItem.name}`;

        expect(orderItemNameText).toBe(expectedName);
        expect(orderItemTotal).toBe(snapItem.total);
      }
    });
  });
});
