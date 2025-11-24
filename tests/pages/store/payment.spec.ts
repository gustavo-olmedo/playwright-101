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
});
