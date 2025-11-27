import { test, expect, Page } from "@playwright/test";
import { StoreApp } from "../../../pages/StoreApp";
import { OrdersPage } from "../../../pages/OrdersPage";
import { PaymentPage } from "../../../pages/PaymentPage";
import {
  addToCartFromCatalog,
  createSingleOrder,
} from "../../../helpers/orders.helper";

test.describe("Store - Orders", () => {
  test.beforeEach(async ({ page }) => {
    const app = new StoreApp(page);
    await app.goto();
    await app.openOrders();
  });

  test("orders shows empty message when there are no orders", async ({
    page,
  }) => {
    const orders = new OrdersPage(page);
    await orders.expectEmpty("No orders registered.");
  });

  test("renders orders layout and list when there is at least one order", async ({
    page,
  }) => {
    await createSingleOrder(page);

    const orders = new OrdersPage(page);

    await test.step("shows orders container and title", async () => {
      await orders.expectLoaded();
    });

    await test.step("shows orders list with at least one order", async () => {
      const list = page.getByTestId("orders-list");
      await expect(list).toBeVisible();

      const rows = list.locator('[data-testid^="order-"]');
      const count = await rows.count();
      expect(count).toBeGreaterThan(0);
    });

    await test.step("checks structure of first order", async () => {
      const index = 0;

      const date = orders.orderDate(index);
      const payment = orders.orderPayment(index);
      const itemsList = orders.orderItemsContainer(index);
      const totalLabel = orders.orderTotalLabel(index);
      const totalValue = orders.orderTotalValue(index);

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
    const orders = await createSingleOrder(page);
    const orderCount = await orders.getOrderCount();

    for (let i = 0; i < orderCount; i++) {
      await test.step(`validates total for order ${i}`, async () => {
        await orders.expectOrderTotalsMatchItems(i);
      });
    }
  });

  test("each order has a valid date line and known payment method", async ({
    page,
  }) => {
    const orders = await createSingleOrder(page);
    const orderCount = await orders.getOrderCount();
    const allowedMethods = ["MBWay", "Klarna", "Multibanco", "PayPal", "Visa"];

    for (let i = 0; i < orderCount; i++) {
      await test.step(`checks date & payment method for order ${i}`, async () => {
        await orders.expectDateAndPaymentValid(i, allowedMethods);
      });
    }
  });

  test("confirming a payment creates a new order with same items, total and payment method", async ({
    page,
  }) => {
    // Initial snapshot of orders
    const initialOrders = new OrdersPage(page);
    const initialOrderCount = await initialOrders.getOrderCount();

    let paymentSnapshot: {
      method: string;
      items: { name: string; quantity: number; total: number }[];
      total: number;
    };

    await test.step("build cart and capture payment snapshot", async () => {
      const app = new StoreApp(page);

      await app.openCatalog();
      await addToCartFromCatalog(page, "Giant Rubber Duck", 1);
      await addToCartFromCatalog(page, "Bacon-Scented Candle", 2);

      await app.openCart();

      const goToPaymentButton = page.getByTestId("cart-go-to-payment");
      await expect(goToPaymentButton).toBeVisible();
      await goToPaymentButton.click();
      await expect(page.getByTestId("payment-page")).toBeVisible();

      const payment = new PaymentPage(page);
      const selectedMethodId = "Visa";

      const methodInput = payment.paymentMethodInput(selectedMethodId);
      await methodInput.check();
      await expect(methodInput).toBeChecked();

      const paymentItemCount = await payment.getItemCount();

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
          (await payment.itemName(i).textContent())?.trim() ?? "";
        const quantityText =
          (await payment.itemQuantity(i).textContent()) || "0";
        const rowTotalText =
          (await payment.itemTotalValue(i).textContent()) || "0";

        const quantity = parseFloat(quantityText.trim());
        const total = parseFloat(rowTotalText.trim());

        snapshot.items.push({ name: nameText, quantity, total });
        sum += total;
      }

      const paymentTotalText = (await payment.totalValue.textContent()) || "0";
      const paymentTotal = parseFloat(paymentTotalText.trim());
      expect(paymentTotal).toBe(parseFloat(sum.toFixed(2)));

      snapshot.total = paymentTotal;
      paymentSnapshot = snapshot;

      await payment.confirmButton.click();
      await expect(page.getByTestId("orders-page")).toBeVisible();
    });

    await test.step("find a new order matching payment snapshot", async () => {
      const orders = new OrdersPage(page);
      const orderCount = await orders.getOrderCount();

      expect(orderCount).toBe(initialOrderCount + 1);

      let matchingOrderIndex: number | null = null;

      for (let i = 0; i < orderCount; i++) {
        const paymentText =
          (await orders.orderPayment(i).textContent())?.trim() ?? "";
        const method = paymentText.replace("Payment Method:", "").trim();

        const orderTotal = await orders.getOrderTotalNumber(i);

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

      const orderItemCount = await orders.getOrderItemsCount(orderIndex);
      expect(orderItemCount).toBe(paymentSnapshot.items.length);

      for (let j = 0; j < orderItemCount; j++) {
        const snapItem = paymentSnapshot.items[j];

        const orderItemNameText =
          (await orders.orderItemName(orderIndex, j).textContent())?.trim() ??
          "";
        const orderItemTotal = await orders.getOrderItemTotalNumber(
          orderIndex,
          j
        );

        const expectedName = `${snapItem.quantity} x ${snapItem.name}`;

        expect(orderItemNameText).toBe(expectedName);
        expect(orderItemTotal).toBe(snapItem.total);
      }
    });
  });
});
