import { test, expect, Page } from "@playwright/test";

async function openPaymentPage(page: Page) {
  await page.goto("/store");
  await page.getByTestId("store-tab-payments").click();
  await expect(page.getByTestId("payment-page")).toBeVisible();
}

async function openCatalogTab(page: Page) {
  await page.getByTestId("store-tab-catalog").click();
  await expect(page.getByTestId("catalog-page")).toBeVisible();
}

async function openCartTab(page: Page) {
  await page.getByTestId("store-tab-cart").click();
  await expect(page.getByTestId("cart-page")).toBeVisible();
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

async function setupPaymentWithItems(page: Page) {
  await openCatalogTab(page);
  await addToCartFromCatalog(page, "Giant Rubber Duck", 1);
  await openCartTab(page);

  // From Cart, click Go to Payments
  const goToPaymentButton = page.getByTestId("cart-go-to-payment");
  await expect(goToPaymentButton).toBeVisible();
  await goToPaymentButton.click();

  // Back on Payment page, now with items
  await expect(page.getByTestId("payment-page")).toBeVisible();
}

test.describe("Store - Payment", () => {
  test.beforeEach(async ({ page }) => {
    await openPaymentPage(page);
  });

  test("payment shows empty message when there are no items to pay", async ({
    page,
  }) => {
    await openPaymentPage(page);

    await expect(page.getByTestId("payment-title")).toHaveText("Payment");
    await expect(page.getByTestId("payment-empty-message")).toBeVisible();
    await expect(page.getByTestId("payment-empty-message")).toHaveText(
      "No items to pay."
    );

    await expect(page.locator('[data-testid="payment-cart-list"]')).toHaveCount(
      0
    );
    await expect(page.locator('[data-testid="payment-summary"]')).toHaveCount(
      0
    );
    await expect(
      page.locator('[data-testid="payment-methods-section"]')
    ).toHaveCount(0);
    await expect(
      page.locator('[data-testid="payment-confirm-button"]')
    ).toHaveCount(0);
  });

  test("renders payment layout, cart items, total and payment methods when there are items", async ({
    page,
  }) => {
    await setupPaymentWithItems(page);

    await test.step("shows payment container and title", async () => {
      await expect(page.getByTestId("payment-page")).toBeVisible();
      const title = page.getByTestId("payment-title");
      await expect(title).toBeVisible();
      await expect(title).toHaveText("Payment");
    });

    await test.step("shows cart items list with at least one item", async () => {
      const list = page.getByTestId("payment-cart-list");
      await expect(list).toBeVisible();

      const items = list.locator('[data-testid^="payment-cart-item-"]');
      const count = await items.count();
      expect(count).toBeGreaterThan(0);
    });

    await test.step("checks structure of first payment item", async () => {
      const index = 0;

      const name = page.getByTestId(`payment-item-name-${index}`);
      const quantity = page.getByTestId(`payment-item-quantity-${index}`);
      const priceCurrency = page.getByTestId(
        `payment-item-price-currency-${index}`
      );
      const priceValue = page.getByTestId(`payment-item-price-value-${index}`);
      const totalCurrency = page.getByTestId(
        `payment-item-total-currency-${index}`
      );
      const totalValue = page.getByTestId(`payment-item-total-value-${index}`);

      await expect(name).toBeVisible();
      await expect(quantity).toBeVisible();
      await expect(priceCurrency).toHaveText("€");
      await expect(priceValue).toBeVisible();
      await expect(totalCurrency).toHaveText("€");
      await expect(totalValue).toBeVisible();
    });

    await test.step("shows payment summary and total", async () => {
      const summary = page.getByTestId("payment-summary");
      await expect(summary).toBeVisible();

      const totalLabel = page.getByTestId("payment-total-label");
      const totalValue = page.getByTestId("payment-total-value");

      await expect(totalLabel).toHaveText("Total: €");
      await expect(totalValue).toBeVisible();
    });

    await test.step("shows payment methods list and all methods are unselected", async () => {
      const methodsSection = page.getByTestId("payment-methods-section");
      await expect(methodsSection).toBeVisible();

      const methodsLabel = page.getByTestId("payment-methods-label");
      await expect(methodsLabel).toHaveText("Payment Method:");

      const methodIds = ["MBWay", "Klarna", "Multibanco", "PayPal", "Visa"];

      for (const id of methodIds) {
        const wrapper = page.getByTestId(`payment-method-${id}`);
        const input = page.getByTestId(`payment-method-input-${id}`);
        const label = page.getByTestId(`payment-method-label-${id}`);

        await expect(wrapper).toBeVisible();
        await expect(input).toBeVisible();
        await expect(label).toBeVisible();
        await expect(label).toHaveText(id);
        await expect(input).not.toBeChecked();
      }
    });

    await test.step("shows Confirm Payment button", async () => {
      const confirmButton = page.getByTestId("payment-confirm-button");
      await expect(confirmButton).toBeVisible();
      await expect(confirmButton).toHaveText("Confirm Payment");
    });
  });

  test("each payment item total equals quantity × price", async ({ page }) => {
    await setupPaymentWithItems(page);

    const list = page.getByTestId("payment-cart-list");
    const items = list.locator('[data-testid^="payment-cart-item-"]');
    const count = await items.count();

    for (let i = 0; i < count; i++) {
      await test.step(`validates row total for payment item ${i}`, async () => {
        const quantityText = await page
          .getByTestId(`payment-item-quantity-${i}`)
          .textContent();
        const priceText = await page
          .getByTestId(`payment-item-price-value-${i}`)
          .textContent();
        const rowTotalText = await page
          .getByTestId(`payment-item-total-value-${i}`)
          .textContent();

        const quantity = parseFloat((quantityText || "0").trim());
        const price = parseFloat((priceText || "0").trim());
        const rowTotal = parseFloat((rowTotalText || "0").trim());

        const expectedRowTotal = parseFloat((quantity * price).toFixed(2));
        expect(rowTotal).toBe(expectedRowTotal);
      });
    }
  });

  test("payment items and total match the cart page", async ({ page }) => {
    // Build cart with a few items, then go to Payment and compare
    let cartSnapshot: {
      items: { name: string; quantity: number; price: number; total: number }[];
      total: number;
    };

    await test.step("build cart and capture snapshot", async () => {
      // From Payment → Catalog
      await openCatalogTab(page);
      await addToCartFromCatalog(page, "Giant Rubber Duck", 1);
      await addToCartFromCatalog(page, "Bacon-Scented Candle", 2);

      // Go to Cart
      await openCartTab(page);

      const list = page.getByTestId("cart-list");
      const items = list.locator('li[data-testid^="cart-item-"]');
      const count = await items.count();

      const result: {
        name: string;
        quantity: number;
        price: number;
        total: number;
      }[] = [];

      let sum = 0;

      for (let i = 0; i < count; i++) {
        const nameText = await page
          .getByTestId(`cart-item-name-${i}`)
          .textContent();
        const quantityText = await page
          .getByTestId(`cart-item-quantity-${i}`)
          .textContent();
        const priceText = await page
          .getByTestId(`cart-item-price-value-${i}`)
          .textContent();
        const rowTotalText = await page
          .getByTestId(`cart-item-total-value-${i}`)
          .textContent();

        const quantity = parseFloat((quantityText || "0").trim());
        const price = parseFloat((priceText || "0").trim());
        const rowTotal = parseFloat((rowTotalText || "0").trim());

        result.push({
          name: (nameText || "").trim(),
          quantity,
          price,
          total: rowTotal,
        });

        sum += rowTotal;
      }

      const cartTotalText = await page
        .getByTestId("cart-total-value")
        .textContent();
      const cartTotal = parseFloat((cartTotalText || "0").trim());
      expect(parseFloat(sum.toFixed(2))).toBe(cartTotal);

      cartSnapshot = { items: result, total: cartTotal };

      const goToPaymentButton = page.getByTestId("cart-go-to-payment");
      await expect(goToPaymentButton).toBeVisible();
      await goToPaymentButton.click();
      await expect(page.getByTestId("payment-page")).toBeVisible();
    });

    await test.step("verify payment page matches cart snapshot", async () => {
      const list = page.getByTestId("payment-cart-list");
      const items = list.locator('[data-testid^="payment-cart-item-"]');
      const count = await items.count();

      expect(count).toBe(cartSnapshot.items.length);

      let paymentSum = 0;

      for (let i = 0; i < count; i++) {
        const nameText = (
          await page.getByTestId(`payment-item-name-${i}`).textContent()
        )?.trim();
        const quantityText = await page
          .getByTestId(`payment-item-quantity-${i}`)
          .textContent();
        const priceText = await page
          .getByTestId(`payment-item-price-value-${i}`)
          .textContent();
        const totalText = await page
          .getByTestId(`payment-item-total-value-${i}`)
          .textContent();

        const quantity = parseFloat((quantityText || "0").trim());
        const price = parseFloat((priceText || "0").trim());
        const total = parseFloat((totalText || "0").trim());

        const fromCart = cartSnapshot.items[i];

        expect(nameText).toBe(fromCart.name);
        expect(quantity).toBe(fromCart.quantity);
        expect(price).toBe(fromCart.price);
        expect(total).toBe(fromCart.total);

        paymentSum += total;
      }

      const paymentTotalText = await page
        .getByTestId("payment-total-value")
        .textContent();
      const paymentTotal = parseFloat((paymentTotalText || "0").trim());

      expect(paymentTotal).toBe(parseFloat(paymentSum.toFixed(2)));
      expect(paymentTotal).toBe(cartSnapshot.total);
    });
  });
});
