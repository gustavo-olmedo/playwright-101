import { test, expect } from "@playwright/test";
import { StoreApp } from "../../../pages/StoreApp";
import { CatalogPage } from "../../../pages/CatalogPage";
import { CartPage } from "../../../pages/CartPage";
import { PaymentPage } from "../../../pages/PaymentPage";
import { OrdersPage } from "../../../pages/OrdersPage";

type SnapshotItem = {
  name: string;
  quantity: number;
  price: number;
  total: number;
};

type CartSnapshot = {
  items: SnapshotItem[];
  total: number;
};

test.describe("Store flow - Multi-product purchase with totals", () => {
  test("completes multi-product purchase and keeps totals consistent", async ({
    page,
  }) => {
    const app = new StoreApp(page);
    await app.goto();

    // I'll buy these two products :-)
    const productsToBuy: { name: string; quantity: number }[] = [
      { name: "Giant Rubber Duck", quantity: 2 },
      { name: "Bacon-Scented Candle", quantity: 3 },
    ];

    const cartSnapshot: CartSnapshot = {
      items: [],
      total: 0,
    };

    await test.step("add multiple products from Catalog", async () => {
      const catalog: CatalogPage = await app.openCatalog();

      for (const product of productsToBuy) {
        const idx = await catalog.findItemIndexByName(product.name);
        expect(idx).not.toBeNull();
        const i = idx as number;

        // Initial quantity and price from catalog
        const startingQty = await catalog.getItemQuantityNumber(i);
        expect(startingQty).toBeGreaterThan(0);
        expect(startingQty).toBeGreaterThanOrEqual(product.quantity);

        const priceText =
          (await catalog.itemPriceValue(i).textContent()) || "0";
        const price = parseFloat(priceText.trim());

        // Click "Add to Cart" N times
        for (let n = 0; n < product.quantity; n++) {
          await catalog.clickAddToCart(i);
        }

        // Quantity should have decreased in the catalog
        const finalQty = await catalog.getItemQuantityNumber(i);
        expect(finalQty).toBe(startingQty - product.quantity);

        const rowTotal = parseFloat((price * product.quantity).toFixed(2));

        cartSnapshot.items.push({
          name: product.name,
          quantity: product.quantity,
          price,
          total: rowTotal,
        });
      }

      // Compute expected cart total from snapshot
      const sum = cartSnapshot.items.reduce((acc, item) => acc + item.total, 0);
      cartSnapshot.total = parseFloat(sum.toFixed(2));
    });

    await test.step("verify Cart items and totals", async () => {
      const cart: CartPage = await app.openCart();
      await cart.expectNotEmpty();

      const itemCount = await cart.getItemCount();
      expect(itemCount).toBe(cartSnapshot.items.length);

      let sum = 0;

      for (const snap of cartSnapshot.items) {
        const idx = await cart.findItemIndexByName(snap.name);
        expect(idx).not.toBeNull();
        const i = idx as number;

        const quantityNow = await cart.getItemQuantityNumber(i);
        const priceNow = await cart.getItemPriceNumber(i);
        const rowTotalNow = await cart.getItemRowTotalNumber(i);

        expect(quantityNow).toBe(snap.quantity);
        expect(priceNow).toBe(snap.price);
        expect(rowTotalNow).toBe(snap.total);

        sum += rowTotalNow;
      }

      const cartTotal = await cart.getCartTotalNumber();
      const expectedSum = parseFloat(sum.toFixed(2));

      expect(cartTotal).toBe(expectedSum);
      expect(cartTotal).toBe(cartSnapshot.total);
    });

    let paymentTotal: number;
    const paymentMethodId = "Visa";

    await test.step("verify Payment items and totals", async () => {
      const cart = new CartPage(page);
      await cart.goToPaymentsAndWait();

      const payment = new PaymentPage(page);
      await payment.expectLoaded();
      await payment.expectHasItemsAndSummary();

      const paymentItemCount = await payment.getItemCount();
      expect(paymentItemCount).toBe(cartSnapshot.items.length);

      let paymentSum = 0;

      // Rely on the order being the same as in Cart / Catalog
      for (let i = 0; i < cartSnapshot.items.length; i++) {
        const snap = cartSnapshot.items[i];

        const nameText =
          (await payment.itemName(i).textContent())?.trim() || "";
        const quantity = await payment.getItemQuantityNumber(i);
        const price = await payment.getItemPriceNumber(i);
        const rowTotal = await payment.getItemRowTotalNumber(i);

        expect(nameText).toBe(snap.name);
        expect(quantity).toBe(snap.quantity);
        expect(price).toBe(snap.price);
        expect(rowTotal).toBe(snap.total);

        paymentSum += rowTotal;
      }

      paymentTotal = await payment.getPaymentTotalNumber();
      const expectedPaymentSum = parseFloat(paymentSum.toFixed(2));

      expect(paymentTotal).toBe(expectedPaymentSum);
      expect(paymentTotal).toBe(cartSnapshot.total);

      // Select payment method but don't confirm yet
      await payment.selectMethod(paymentMethodId);
    });

    await test.step("confirm payment and verify Orders record", async () => {
      const payment = new PaymentPage(page);
      await payment.confirmPayment();

      const orders = new OrdersPage(page);
      await orders.expectLoaded();

      const orderCount = await orders.getOrderCount();
      expect(orderCount).toBeGreaterThan(0);

      // Assume most recent order is last in the list
      const orderIndex = orderCount - 1;

      // Check date + payment method
      await orders.expectDateAndPaymentValid(orderIndex, [
        paymentMethodId,
        "MBWay",
        "Klarna",
        "Multibanco",
        "PayPal",
      ]);

      // Check order total vs payment total
      const orderTotal = await orders.getOrderTotalNumber(orderIndex);
      expect(orderTotal).toBe(paymentTotal);

      // Check per-item totals & "quantity x name" format
      await orders.expectOrderTotalsMatchItems(orderIndex);

      const orderItemsCount = await orders.getOrderItemsCount(orderIndex);
      expect(orderItemsCount).toBe(cartSnapshot.items.length);

      for (let j = 0; j < orderItemsCount; j++) {
        const snap = cartSnapshot.items[j];

        const orderItemNameText =
          (await orders.orderItemName(orderIndex, j).textContent())?.trim() ??
          "";
        const orderItemTotal = await orders.getOrderItemTotalNumber(
          orderIndex,
          j
        );

        const expectedName = `${snap.quantity} x ${snap.name}`;

        expect(orderItemNameText).toBe(expectedName);
        expect(orderItemTotal).toBe(snap.total);
      }
    });
  });
});
