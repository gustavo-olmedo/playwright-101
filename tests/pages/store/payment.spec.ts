import { test, expect, Page } from "@playwright/test";

async function openPaymentPage(page: Page) {
  await page.goto("/store");
  await page.getByTestId("store-tab-payments").click();
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
});
