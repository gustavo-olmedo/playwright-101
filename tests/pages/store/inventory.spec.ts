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

  test("shows alert if form is submitted with empty inputs", async ({
    page,
  }) => {
    // using the once is the only way I could make it work
    // tried with:
    //   const [dialog] = await Promise.all([
    //     page.waitForEvent("dialog"),
    //     page.getByTestId("inventory-submit-button").click(),
    //   ]);
    // and also just const dialog = await page.waitForEvent("dialog")
    page.once("dialog", async (dialog) => {
      // I notice this in the documentation about assertions
      // "Use `expect.soft` for non-terminating failures."
      // ref: https://playwright.dev/docs/test-assertions
      expect.soft(dialog.message()).toBe("Please fill in all fields!");
      await dialog.accept();
    });

    await page.getByTestId("inventory-submit-button").click();
  });

  test("shows alert if any required field is missing", async ({ page }) => {
    await page.getByTestId("inventory-input-name").fill("Test Product");
    await page.getByTestId("inventory-input-price").fill("10.5");

    let dialogMessage: string | null = null;

    page.once("dialog", async (dialog) => {
      dialogMessage = dialog.message();
      await dialog.accept();
    });

    await test.step("submits with one missing field", async () => {
      await page.getByTestId("inventory-submit-button").click();
    });

    await test.step("verifies same alert is shown", async () => {
      expect.soft(dialogMessage).toBe("Please fill in all fields!");
    });
  });
});
