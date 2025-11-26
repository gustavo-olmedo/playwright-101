import { test, expect } from "@playwright/test";
import { StoreApp } from "../../../pages/StoreApp";
import { OrdersPage } from "../../../pages/OrdersPage";
import { createSingleOrder } from "../../../helpers/orders.helper";

test.describe("Store flow - Orders history display + structure", () => {
  test("completed purchases appear in Orders with proper structure and totals", async ({
    page,
  }) => {
    const app = new StoreApp(page);
    await app.goto();

    await test.step("open Orders page and verify empty state", async () => {
      const orders = await app.openOrders();
      await orders.expectEmpty("No orders registered.");
    });

    let ordersAfterPurchase: OrdersPage;

    await test.step("complete a purchase to create at least one order", async () => {
      ordersAfterPurchase = await createSingleOrder(page, "Visa");
    });

    await test.step("orders list is visible and has at least one order", async () => {
      const orderCount = await ordersAfterPurchase.getOrderCount();
      expect(orderCount).toBeGreaterThan(0);
    });

    const allowedMethods = ["MBWay", "Klarna", "Multibanco", "PayPal", "Visa"];

    await test.step("each order has valid structure and correct totals", async () => {
      const orderCount = await ordersAfterPurchase.getOrderCount();

      for (let i = 0; i < orderCount; i++) {
        // Container + title is already covered by expectLoaded
        // here we focus on per-order content.
        await test.step(`validate order #${i} structure & data`, async () => {
          // Date + payment method line
          await ordersAfterPurchase.expectDateAndPaymentValid(
            i,
            allowedMethods
          );

          // Items container: should have at least one item
          const itemsContainer = ordersAfterPurchase.orderItemsContainer(i);
          await expect(itemsContainer).toBeVisible();

          const itemsCount = await ordersAfterPurchase.getOrderItemsCount(i);
          expect(itemsCount).toBeGreaterThan(0);

          await expect(ordersAfterPurchase.orderTotalLabel(i)).toHaveText(
            "Total: €"
          );
          await expect(ordersAfterPurchase.orderTotalValue(i)).toBeVisible();
          await ordersAfterPurchase.expectOrderTotalsMatchItems(i);
        });
      }
    });
  });
});
