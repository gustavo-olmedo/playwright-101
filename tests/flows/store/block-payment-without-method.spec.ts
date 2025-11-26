import { test, expect } from "@playwright/test";
import { StoreApp } from "../../../pages/StoreApp";
import { CartPage } from "../../../pages/CartPage";
import { PaymentPage } from "../../../pages/PaymentPage";
import { addToCartFromCatalog } from "../../../helpers/payment.helper";

test.describe("Store flow - Block payment without method", () => {
  test("from Cart all the way to Payment, block confirming without selecting a method", async ({
    page,
  }) => {
    const app = new StoreApp(page);
    await app.goto();

    const productName = "Giant Rubber Duck";
    let cart: CartPage;

    await test.step("start on Cart page with an empty cart", async () => {
      cart = await app.openCart();
      await cart.expectEmpty(); // "Your cart is empty."
    });

    await test.step("add item from Catalog", async () => {
      await addToCartFromCatalog(page, productName, 1);
    });

    await test.step("Cart now has items and shows summary", async () => {
      cart = await app.openCart();
      await cart.expectNotEmpty();

      const itemCount = await cart.getItemCount();
      expect(itemCount).toBeGreaterThan(0);

      const index = await cart.findItemIndexByName(productName);
      expect(index).not.toBeNull();
    });

    let payment: PaymentPage;

    await test.step("navigate from Cart to Payment", async () => {
      await cart.goToPaymentsAndWait();

      payment = new PaymentPage(page);
      await payment.expectLoaded();
      await payment.expectHasItemsAndSummary();
    });

    await test.step('click "Confirm Payment" with no method selected and verify alert', async () => {
      await payment.confirmWithoutMethodExpectAlert(
        "Please select a payment method!",
        { soft: true }
      );
    });

    await test.step("stay on Payment page and do not navigate to Orders", async () => {
      await payment.expectLoaded(); // still on Payment page
      await expect(page.getByTestId("orders-page")).toHaveCount(0);
    });
  });
});
