import { test, expect, Page } from "@playwright/test";

async function openInventoryPage(page: Page) {
  await page.goto("/store");
  await page.getByTestId("store-tab-inventory").click();
  await expect(page.getByTestId("inventory-page")).toBeVisible();
}

async function openCatalogPage(page: Page, reload: boolean = true) {
  if (reload) await page.goto("/store");
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

  test("disables Add to Cart and shows Out of Stock when quantity is 0", async ({
    page,
  }) => {
    // The item-6 have "0 units" and Out of Stock so I'll use it to validate
    const index = 6;

    const quantity = page.getByTestId(`catalog-item-quantity-${index}`);
    const addButton = page.getByTestId(`catalog-item-add-button-${index}`);

    await test.step("shows 0 units", async () => {
      await expect(quantity).toHaveText("0 units");
    });

    await test.step("shows disabled Out of Stock button", async () => {
      await expect(addButton).toBeDisabled();
      await expect(addButton).toHaveText("Out of Stock");
    });
  });

  test("clicking Add to Cart decrements available quantity", async ({
    page,
  }) => {
    // I choose a product with stock > 0 so this case catalog-item-1
    const index = 1;

    const quantity = page.getByTestId(`catalog-item-quantity-${index}`);
    const addButton = page.getByTestId(`catalog-item-add-button-${index}`);

    const initialText = await quantity.textContent();
    const initialQty = parseInt(initialText || "0", 10);

    await test.step("has a positive starting quantity and enabled button", async () => {
      expect(initialQty).toBeGreaterThan(0);
      await expect(addButton).toBeEnabled();
      await expect(addButton).toHaveText("Add to Cart");
    });

    await test.step("decrements quantity after one click", async () => {
      await addButton.click();
      await expect(quantity).toHaveText(`${initialQty - 1} units`);
    });

    await test.step("decrements quantity after another click", async () => {
      await addButton.click();
      await expect(quantity).toHaveText(`${initialQty - 2} units`);
    });
  });

  test("product added in inventory appears in catalog with same price and quantity", async ({
    page,
  }) => {
    const newProductName = "Catalog Sync Test Product";
    const priceValue = "13.37";
    const quantityValue = "3";

    await test.step("create product in Inventory", async () => {
      await openInventoryPage(page);

      await page.getByTestId("inventory-input-name").fill(newProductName);
      await page.getByTestId("inventory-input-price").fill(priceValue);
      await page.getByTestId("inventory-input-quantity").fill(quantityValue);
      await page.getByTestId("inventory-submit-button").click();

      // ensure it was added on the inventory side (last product)
      const invList = page.getByTestId("inventory-product-list");
      const invItems = invList.locator('li[data-testid^="inventory-product-"]');
      const invCount = await invItems.count();
      const invIndex = invCount - 1;

      await expect(
        page.getByTestId(`inventory-product-name-${invIndex}`)
      ).toHaveText(newProductName);
      await expect(
        page.getByTestId(`inventory-product-price-value-${invIndex}`)
      ).toHaveText(priceValue);
      await expect(
        page.getByTestId(`inventory-product-quantity-${invIndex}`)
      ).toHaveText("3");
    });

    await test.step("open Catalog and find the new product", async () => {
      await openCatalogPage(page, false);

      const list = page.getByTestId("catalog-list");
      const items = list.locator('li[data-testid^="catalog-item-"]');
      const count = await items.count();
      const lastIndex = count - 1;

      const name = page.getByTestId(`catalog-item-name-${lastIndex}`);
      const price = page.getByTestId(`catalog-item-price-value-${lastIndex}`);
      const quantity = page.getByTestId(`catalog-item-quantity-${lastIndex}`);

      await expect(name).toHaveText(newProductName);
      await expect(price).toHaveText(priceValue);
      await expect(quantity).toHaveText("3 units");
    });
  });
});
