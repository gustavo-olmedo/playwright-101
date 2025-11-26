import { test, expect } from "@playwright/test";
import { StoreApp } from "../../../pages/StoreApp";
import { HomePage } from "../../../pages/HomePage";
import { CartPage } from "../../../pages/CartPage";
import { PaymentPage } from "../../../pages/PaymentPage";
import { OrdersPage } from "../../../pages/OrdersPage";
import { addToCartFromCatalog } from "../../../helpers/payment.helper";

test.describe("Store flow - End-to-end from Instructions to Orders", () => {
  test("user can read instructions, buy a product, and see it in Orders history", async ({
    page,
  }) => {
    const app = new StoreApp(page);
    await app.goto();

    // ------------------------------------------------------------
    // 1) Start on Instructions (Home) and verify basic structure
    // ------------------------------------------------------------
    const home: HomePage = await app.openHome();
    await home.expectLoaded();

    await test.step("home shows all instruction sections in correct order", async () => {
      await home.expectSectionsCount(5);
      await home.expectSectionsOrder([
        "inventory",
        "catalog",
        "cart",
        "payment",
        "orders",
      ]);
    });

    // ------------------------------------------------------------
    // 2) Snapshot current Orders count (so we can assert +1 later)
    // ------------------------------------------------------------
    let initialOrderCount = 0;

    await test.step("check current orders count", async () => {
      const orders = await app.openOrders();
      initialOrderCount = await orders.getOrderCount();
    });

    // ------------------------------------------------------------
    // 3) Add a product from Catalog and verify Cart
    // ------------------------------------------------------------
    const productName = "Giant Rubber Duck";
    const quantityToBuy = 2;

    await test.step("add product from Catalog", async () => {
      await addToCartFromCatalog(page, productName, quantityToBuy);
    });

    let cart: CartPage;

    await test.step("verify cart contains chosen product with correct quantity and totals", async () => {
      cart = await app.openCart();
      await cart.expectNotEmpty();

      const index = await cart.findItemIndexByName(productName);
      expect(index).not.toBeNull();
      const i = index as number;

      const qty = await cart.getItemQuantityNumber(i);
      const price = await cart.getItemPriceNumber(i);
      const rowTotal = await cart.getItemRowTotalNumber(i);
      const cartTotal = await cart.getCartTotalNumber();

      expect(qty).toBe(quantityToBuy);

      const expectedRowTotal = parseFloat((price * qty).toFixed(2));
      expect(rowTotal).toBe(expectedRowTotal);

      // In this flow we only added this one product,
      // so cart total should match its row total.
      expect(cartTotal).toBe(expectedRowTotal);
    });

    // ------------------------------------------------------------
    // 4) Go to Payment, verify summary and capture snapshot
    // ------------------------------------------------------------
    await test.step("navigate from Cart to Payment", async () => {
      await cart.goToPaymentsAndWait();
    });

    const payment = new PaymentPage(page);
    await payment.expectLoaded();

    const snapshot: {
      method: string;
      items: { name: string; quantity: number; total: number }[];
      total: number;
    } = {
      method: "Visa",
      items: [],
      total: 0,
    };

    await test.step("verify payment summary and capture items + totals", async () => {
      await payment.expectHasItemsAndSummary();

      const itemCount = await payment.getItemCount();
      expect(itemCount).toBeGreaterThan(0);

      let sum = 0;

      for (let i = 0; i < itemCount; i++) {
        await payment.expectItemStructure(i);

        const nameText =
          (await payment.itemName(i).textContent())?.trim() ?? "";
        const quantity = await payment.getItemQuantityNumber(i);
        const rowTotal = await payment.getItemRowTotalNumber(i);

        snapshot.items.push({ name: nameText, quantity, total: rowTotal });
        sum += rowTotal;
      }

      const paymentTotal = await payment.getPaymentTotalNumber();
      expect(paymentTotal).toBe(parseFloat(sum.toFixed(2)));

      snapshot.total = paymentTotal;
    });

    // ------------------------------------------------------------
    // 5) Select payment method and confirm, landing on Orders
    // ------------------------------------------------------------
    await test.step("select payment method and confirm", async () => {
      await payment.selectMethod(snapshot.method);
      await payment.confirmPayment();
    });

    const orders = new OrdersPage(page);
    await orders.expectLoaded();

    // ------------------------------------------------------------
    // 6) Verify there is a new order and its data matches Payment
    // ------------------------------------------------------------
    await test.step("orders count increased by 1", async () => {
      const orderCount = await orders.getOrderCount();
      expect(orderCount).toBe(initialOrderCount + 1);
    });

    let matchingOrderIndex: number | null = null;

    await test.step("find order matching payment method and total", async () => {
      const orderCount = await orders.getOrderCount();

      for (let i = 0; i < orderCount; i++) {
        const paymentText =
          (await orders.orderPayment(i).textContent())?.trim() ?? "";
        const method = paymentText.replace("Payment Method:", "").trim();

        const orderTotal = await orders.getOrderTotalNumber(i);

        if (method === snapshot.method && orderTotal === snapshot.total) {
          matchingOrderIndex = i;
          break;
        }
      }

      expect(matchingOrderIndex).not.toBeNull();
    });

    const orderIndex = matchingOrderIndex as unknown as number;

    await test.step("validate date / payment line and per-order totals", async () => {
      await orders.expectDateAndPaymentValid(orderIndex, [
        "MBWay",
        "Klarna",
        "Multibanco",
        "PayPal",
        "Visa",
      ]);

      await orders.expectOrderTotalsMatchItems(orderIndex);
    });

    await test.step("validate that order items match payment snapshot", async () => {
      const orderItemsCount = await orders.getOrderItemsCount(orderIndex);
      expect(orderItemsCount).toBe(snapshot.items.length);

      for (let j = 0; j < orderItemsCount; j++) {
        const snapItem = snapshot.items[j];

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
