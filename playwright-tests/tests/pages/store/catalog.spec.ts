import { test, expect } from "@playwright/test";
import { StoreApp } from "../../../pages/StoreApp";
import { CatalogPage } from "../../../pages/CatalogPage";

test.describe("Store - Catalog", () => {
  test.beforeEach(async ({ page }) => {
    const app = new StoreApp(page);
    await app.goto();
    await app.openCatalog();
  });

  test("renders catalog layout and product list", async ({ page }) => {
    const catalog = new CatalogPage(page);

    await test.step("shows catalog container and title", async () => {
      await catalog.expectContainerAndTitle();
    });

    await test.step("shows catalog list with at least one item", async () => {
      await catalog.expectListHasItems();
    });

    await test.step("validates basic structure of a known in-stock item", async () => {
      const index = 1; // Giant Rubber Duck (in stock)
      await catalog.expectItemBasicStructure(index, {
        expectedButtonText: "Add to Cart",
      });
    });
  });

  test("disables Add to Cart and shows Out of Stock when quantity is 0", async ({
    page,
  }) => {
    const catalog = new CatalogPage(page);
    const index = 6; // Invisible Pen: 0 units, Out of Stock

    await test.step("shows 0 units and disabled Out of Stock button", async () => {
      await catalog.expectOutOfStock(index);
    });
  });

  test("clicking Add to Cart decrements available quantity", async ({
    page,
  }) => {
    const catalog = new CatalogPage(page);
    const index = 1; // Giant Rubber Duck: stock > 0

    const initialQty = await catalog.getItemQuantityNumber(index);

    await test.step("has a positive starting quantity and enabled button", async () => {
      expect(initialQty).toBeGreaterThan(0);
      await expect(catalog.addToCartButton(index)).toBeEnabled();
      await expect(catalog.addToCartButton(index)).toHaveText("Add to Cart");
    });

    await test.step("decrements quantity after one click", async () => {
      await catalog.clickAddToCart(index);
      await expect(catalog.itemQuantity(index)).toHaveText(
        `${initialQty - 1} units`
      );
    });

    await test.step("decrements quantity after another click", async () => {
      await catalog.clickAddToCart(index);
      await expect(catalog.itemQuantity(index)).toHaveText(
        `${initialQty - 2} units`
      );
    });
  });

  test("product added in inventory appears in catalog with same price and quantity", async ({
    page,
  }) => {
    const app = new StoreApp(page);
    const newProductName = "Catalog Sync Test Product";
    const priceValue = "13.37";
    const quantityValue = "3";

    await test.step("create product in Inventory", async () => {
      const inventory = await app.openInventory();

      await inventory.addProduct(newProductName, priceValue, quantityValue);

      const invCount = await inventory.getProductCount();
      const invIndex = invCount - 1;

      await expect(inventory.productName(invIndex)).toHaveText(newProductName);
      await expect(inventory.productPriceValue(invIndex)).toHaveText(
        priceValue
      );
      await expect(inventory.productQuantity(invIndex)).toHaveText("3");
    });

    await test.step("open Catalog and find the new product", async () => {
      const catalog = await app.openCatalog();

      const count = await catalog.getItemCount();
      const lastIndex = count - 1;

      await expect(catalog.itemName(lastIndex)).toHaveText(newProductName);
      await expect(catalog.itemPriceValue(lastIndex)).toHaveText(priceValue);
      await expect(catalog.itemQuantity(lastIndex)).toHaveText("3 units");
    });
  });

  test("when stock reaches 0, Add to Cart becomes disabled and shows Out of Stock", async ({
    page,
  }) => {
    const app = new StoreApp(page);
    const newProductName = "One Unit Only Product";
    const priceValue = "9.99";
    const quantityValue = "1";

    await test.step("create a 1-quantity product in Inventory", async () => {
      const inventory = await app.openInventory();
      await inventory.addProduct(newProductName, priceValue, quantityValue);
    });

    await test.step("find that product in the Catalog", async () => {
      const catalog = await app.openCatalog();

      const index = await catalog.findItemIndexByName(newProductName);
      expect(index).not.toBeNull();
      const i = index as number;

      await catalog.expectInStock(i, 1);

      await test.step("click Add to Cart once to reach 0 stock", async () => {
        await catalog.clickAddToCart(i);
        await expect(catalog.itemQuantity(i)).toHaveText("0 units");
      });

      await test.step("button becomes disabled and shows Out of Stock", async () => {
        await expect(catalog.addToCartButton(i)).toBeDisabled();
        await expect(catalog.addToCartButton(i)).toHaveText("Out of Stock");
      });
    });
  });
});
