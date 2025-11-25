import { test, expect } from "@playwright/test";
import { StoreApp } from "../../../pages/StoreApp";
import { CartPage } from "../../../pages/CartPage";
import { PaymentPage } from "../../../pages/PaymentPage";
import {
  addToCartFromCatalog,
  setupPaymentWithItems,
} from "../../../helpers/payment.helper";

test.describe("Store - Payment", () => {
  test.beforeEach(async ({ page }) => {
    const app = new StoreApp(page);
    await app.goto();
    await app.openPayment();
  });

  test("payment shows empty message when there are no items to pay", async ({
    page,
  }) => {
    const payment = new PaymentPage(page);
    await payment.expectEmpty("No items to pay.");
  });

  test("renders payment layout, cart items, total and payment methods when there are items", async ({
    page,
  }) => {
    const payment = await setupPaymentWithItems(page);

    await test.step("shows payment container and title", async () => {
      await payment.expectLoaded();
    });

    await test.step("shows cart items list with at least one item", async () => {
      await payment.expectHasItemsAndSummary();
    });

    await test.step("checks structure of first payment item", async () => {
      await payment.expectItemStructure(0);
    });

    await test.step("shows payment summary and total", async () => {
      await payment.expectHasItemsAndSummary();
    });

    await test.step("shows payment methods list and all methods are unselected", async () => {
      const methodIds = ["MBWay", "Klarna", "Multibanco", "PayPal", "Visa"];
      await payment.expectMethodsUnselected(methodIds);
    });

    await test.step("shows Confirm Payment button", async () => {
      await expect(payment.confirmButton).toBeVisible();
      await expect(payment.confirmButton).toHaveText("Confirm Payment");
    });
  });

  test("each payment item total equals quantity × price", async ({ page }) => {
    const payment = await setupPaymentWithItems(page);

    const count = await payment.getItemCount();

    for (let i = 0; i < count; i++) {
      await test.step(`validates row total for payment item ${i}`, async () => {
        const quantity = await payment.getItemQuantityNumber(i);
        const price = await payment.getItemPriceNumber(i);
        const rowTotal = await payment.getItemRowTotalNumber(i);

        const expectedRowTotal = parseFloat((quantity * price).toFixed(2));
        expect(rowTotal).toBe(expectedRowTotal);
      });
    }
  });

  test("payment items and total match the cart page", async ({ page }) => {
    const app = new StoreApp(page);

    let cartSnapshot: {
      items: { name: string; quantity: number; price: number; total: number }[];
      total: number;
    };

    await test.step("build cart and capture snapshot", async () => {
      // From Payment -> Catalog
      await app.openCatalog();
      await addToCartFromCatalog(page, "Giant Rubber Duck", 1);
      await addToCartFromCatalog(page, "Bacon-Scented Candle", 2);

      // Go to Cart
      const cart = await app.openCart();
      const cartPage = new CartPage(page);

      const count = await cartPage.getItemCount();
      const items: {
        name: string;
        quantity: number;
        price: number;
        total: number;
      }[] = [];

      let sum = 0;

      for (let i = 0; i < count; i++) {
        const nameText =
          (await cartPage.itemName(i).textContent())?.trim() || "";
        const quantity = await cartPage.getItemQuantityNumber(i);
        const price = await cartPage.getItemPriceNumber(i);
        const total = await cartPage.getItemRowTotalNumber(i);

        items.push({ name: nameText, quantity, price, total });
        sum += total;
      }

      const cartTotal = await cartPage.getCartTotalNumber();
      expect(parseFloat(sum.toFixed(2))).toBe(cartTotal);

      cartSnapshot = { items, total: cartTotal };

      await cart.goToPaymentsAndWait();
    });

    await test.step("verify payment page matches cart snapshot", async () => {
      const payment = new PaymentPage(page);

      const count = await payment.getItemCount();
      expect(count).toBe(cartSnapshot.items.length);

      let paymentSum = 0;

      for (let i = 0; i < count; i++) {
        const nameText =
          (await payment.itemName(i).textContent())?.trim() || "";
        const quantity = await payment.getItemQuantityNumber(i);
        const price = await payment.getItemPriceNumber(i);
        const total = await payment.getItemRowTotalNumber(i);

        const fromCart = cartSnapshot.items[i];

        expect(nameText).toBe(fromCart.name);
        expect(quantity).toBe(fromCart.quantity);
        expect(price).toBe(fromCart.price);
        expect(total).toBe(fromCart.total);

        paymentSum += total;
      }

      const paymentTotal = await payment.getPaymentTotalNumber();
      expect(paymentTotal).toBe(parseFloat(paymentSum.toFixed(2)));
      expect(paymentTotal).toBe(cartSnapshot.total);
    });
  });

  test("shows alert if confirming payment without selecting a payment method", async ({
    page,
  }) => {
    const payment = await setupPaymentWithItems(page);

    await test.step("click Confirm Payment with no method selected", async () => {
      await payment.confirmWithoutMethodExpectAlert(
        "Please select a payment method!",
        { soft: true }
      );
    });
  });

  test("selecting a payment method and confirming navigates to Orders section", async ({
    page,
  }) => {
    const payment = await setupPaymentWithItems(page);

    await test.step("select a payment method", async () => {
      await payment.selectMethod("MBWay");
    });

    await test.step("confirm payment", async () => {
      await payment.confirmPayment();
    });

    await test.step("lands on Orders page", async () => {
      await expect(page.getByTestId("orders-page")).toBeVisible();
    });
  });
});
