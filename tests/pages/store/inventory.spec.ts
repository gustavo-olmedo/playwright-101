import { test, expect, Page } from "@playwright/test";

async function openInventoryPage(page: Page) {
  await page.goto("/store");
  await page.getByTestId("store-tab-inventory").click();
  await expect(page.getByTestId("inventory-page")).toBeVisible();
}

test.describe("Store - Inventory", () => {
  test.beforeEach(async ({ page }) => {
    await openInventoryPage(page);
  });

  test("renders inventory layout with form and initial product list", async ({
    page,
  }) => {
    await test.step("shows inventory container and title", async () => {
      await expect(page.getByTestId("inventory-page")).toBeVisible();

      const title = page.getByTestId("inventory-title");
      await expect(title).toBeVisible();
      await expect(title).toHaveText("Inventory Management");
    });

    await test.step("shows form with three inputs", async () => {
      const form = page.getByTestId("inventory-form");
      await expect(form).toBeVisible();

      const nameInput = page.getByTestId("inventory-input-name");
      const priceInput = page.getByTestId("inventory-input-price");
      const quantityInput = page.getByTestId("inventory-input-quantity");

      await expect(nameInput).toBeVisible();
      await expect(priceInput).toBeVisible();
      await expect(quantityInput).toBeVisible();

      await expect(nameInput).toHaveAttribute("type", "text");
      await expect(priceInput).toHaveAttribute("type", "number");
      await expect(quantityInput).toHaveAttribute("type", "number");

      await expect(nameInput).toHaveAttribute("placeholder", "Product Name");
      await expect(priceInput).toHaveAttribute("placeholder", "Price (€)");
      await expect(quantityInput).toHaveAttribute("placeholder", "Quantity");
    });

    await test.step("shows submit button", async () => {
      const submitButton = page.getByTestId("inventory-submit-button");
      await expect(submitButton).toBeVisible();
      await expect(submitButton).toHaveText("Add Product");
    });

    await test.step("shows initial product list", async () => {
      const list = page.getByTestId("inventory-product-list");
      await expect(list).toBeVisible();

      const products = list.locator('[data-testid^="inventory-product-"]');
      const count = await products.count();
      expect(count).toBeGreaterThan(0);
    });
  });
});
