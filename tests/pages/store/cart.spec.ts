import { test, expect, Page } from "@playwright/test";

async function openCartPage(page: Page, reload: boolean = true) {
  if (reload) await page.goto("/store");
  await page.getByTestId("store-tab-cart").click();
  await expect(page.getByTestId("cart-page")).toBeVisible();
}

async function openCatalogPage(page: Page, reload: boolean = true) {
  if (reload) await page.goto("/store");
  await page.getByTestId("store-tab-catalog").click();
  await expect(page.getByTestId("catalog-page")).toBeVisible();
}

async function findCatalogItemIndexByName(page: Page, productName: string) {
  const list = page.getByTestId("catalog-list");
  const items = list.locator('li[data-testid^="catalog-item-"]');
  const count = await items.count();

  for (let i = 0; i < count; i++) {
    const nameLocator = page.getByTestId(`catalog-item-name-${i}`);
    const nameText = (await nameLocator.textContent())?.trim();
    if (nameText === productName) {
      return i;
    }
  }

  return null;
}

async function addToCartFromCatalog(
  page: Page,
  productName: string,
  times = 1
) {
  await openCatalogPage(page);

  const index = await findCatalogItemIndexByName(page, productName);
  expect(index).not.toBeNull();

  const i = index as number;
  const button = page.getByTestId(`catalog-item-add-button-${i}`);

  for (let t = 0; t < times; t++) {
    await expect(button).toBeEnabled();
    await button.click();
  }
}

test.describe("Store - Cart", () => {
  test.beforeEach(async ({ page }) => {
    await openCartPage(page);
  });

  test("cart shows empty message when there are no items", async ({ page }) => {
    await openCartPage(page);

    await expect(page.getByTestId("cart-title")).toHaveText("Your Cart");
    await expect(page.getByTestId("cart-empty-message")).toBeVisible();
    await expect(page.getByTestId("cart-empty-message")).toHaveText(
      "Your cart is empty."
    );

    // No cart list / summary should exist
    const list = page.locator('[data-testid="cart-list"]');
    await expect(list).toHaveCount(0);
    const summary = page.locator('[data-testid="cart-summary"]');
    await expect(summary).toHaveCount(0);
  });

  test("cart shows items and summary after adding from catalog", async ({
    page,
  }) => {
    await test.step("add one product from catalog", async () => {
      await addToCartFromCatalog(page, "Giant Rubber Duck", 1);
    });

    await test.step("open cart page", async () => {
      await openCartPage(page, false);
    });

    await test.step("empty message is not shown", async () => {
      const emptyMessage = page.locator('[data-testid="cart-empty-message"]');
      await expect(emptyMessage).toHaveCount(0);
    });

    await test.step("cart list and summary are visible", async () => {
      const list = page.getByTestId("cart-list");
      await expect(list).toBeVisible();

      const items = list.locator('[data-testid^="cart-item-"]');
      const count = await items.count();
      expect(count).toBeGreaterThan(0);

      const summary = page.getByTestId("cart-summary");
      await expect(summary).toBeVisible();
      await expect(page.getByTestId("cart-total-label")).toHaveText("Total: €");
      await expect(page.getByTestId("cart-total-value")).toBeVisible();
    });
  });
});
