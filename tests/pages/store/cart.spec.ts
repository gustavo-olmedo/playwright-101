import { test, expect, Page } from "@playwright/test";

async function openCartPage(page: Page) {
  await page.goto("/store");
  await page.getByTestId("store-tab-cart").click();
  await expect(page.getByTestId("cart-page")).toBeVisible();
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
});
