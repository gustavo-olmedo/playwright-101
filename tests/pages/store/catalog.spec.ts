import { test, expect, Page } from "@playwright/test";

async function openCatalogPage(page: Page) {
  await page.goto("/store");
  await page.getByTestId("store-tab-catalog").click();
  await expect(page.getByTestId("catalog-page")).toBeVisible();
}

test.describe("Store - Catalog", () => {
  test.beforeEach(async ({ page }) => {
    await openCatalogPage(page);
  });

  test("renders catalog layout and product list", async ({ page }) => {
    await test.step("shows catalog container and title", async () => {
      await expect(page.getByTestId("catalog-page")).toBeVisible();

      const title = page.getByTestId("catalog-title");
      await expect(title).toBeVisible();
      await expect(title).toHaveText("Product Catalog");
    });

    await test.step("shows catalog list with at least one item", async () => {
      const list = page.getByTestId("catalog-list");
      await expect(list).toBeVisible();

      const items = list.locator('[data-testid^="catalog-item-"]');
      const count = await items.count();
      expect(count).toBeGreaterThan(0);
    });

    await test.step("validates basic structure of the first item", async () => {
      const index = 1;
      const name = page.getByTestId(`catalog-item-name-${index}`);
      const priceLabel = page.getByTestId(`catalog-item-price-label-${index}`);
      const priceValue = page.getByTestId(`catalog-item-price-value-${index}`);
      const quantity = page.getByTestId(`catalog-item-quantity-${index}`);
      const addButton = page.getByTestId(`catalog-item-add-button-${index}`);

      await expect(name).toBeVisible();
      await expect(priceLabel).toHaveText("Price: €");
      await expect(priceValue).toBeVisible();
      await expect(quantity).toContainText("units");
      await expect(addButton).toBeVisible();
      await expect(addButton).toHaveText("Add to Cart");
    });

    await test.step("shows catalog list with at least one item", async () => {
      const list = page.getByTestId("catalog-list");
      await expect(list).toBeVisible();

      const items = list.locator('[data-testid^="catalog-item-"]');
      const count = await items.count();
      expect(count).toBeGreaterThan(0);
    });

    await test.step("validates basic structure of the first item", async () => {
      const index = 1; // pick a known in-stock item from your sample (Giant Rubber Duck)

      const name = page.getByTestId(`catalog-item-name-${index}`);
      const priceLabel = page.getByTestId(`catalog-item-price-label-${index}`);
      const priceValue = page.getByTestId(`catalog-item-price-value-${index}`);
      const quantity = page.getByTestId(`catalog-item-quantity-${index}`);
      const addButton = page.getByTestId(`catalog-item-add-button-${index}`);

      await expect(name).toBeVisible();
      await expect(priceLabel).toHaveText("Price: €");
      await expect(priceValue).toBeVisible();
      await expect(quantity).toContainText("units");
      await expect(addButton).toBeVisible();
      await expect(addButton).toHaveText("Add to Cart");
    });
  });
});
