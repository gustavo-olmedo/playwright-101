import { test, expect } from "@playwright/test";
import { StoreApp } from "../../../pages/StoreApp";
import { InventoryPage } from "../../../pages/InventoryPage";
import { CatalogPage } from "../../../pages/CatalogPage";

test.describe("Store flow - Inventory–catalog sync - mark products Out of Stock", () => {
  test("inventory stock syncs to catalog and becomes Out of Stock when depleted", async ({
    page,
  }) => {
    const app = new StoreApp(page);
    await app.goto();

    const newProductName = "Flow Out-of-Stock Product";
    const priceValue = "9.99";
    const quantityValue = "2"; // small number so we can drive it to 0

    let inventoryIndex: number;
    let catalogIndex: number;

    await test.step("create product in Inventory", async () => {
      const inventory: InventoryPage = await app.openInventory();

      const initialCount = await inventory.getProductCount();

      await inventory.addProduct(newProductName, priceValue, quantityValue);

      // New product should be last in the list
      inventoryIndex = (await inventory.getProductCount()) - 1;
      expect(inventoryIndex).toBe(initialCount); // appended at the end

      await expect(inventory.productName(inventoryIndex)).toHaveText(
        newProductName
      );
      await expect(inventory.productPriceValue(inventoryIndex)).toHaveText(
        priceValue
      );
      await expect(inventory.productQuantity(inventoryIndex)).toHaveText(
        quantityValue
      );
    });

    await test.step("verify product appears in Catalog with same stock", async () => {
      const catalog: CatalogPage = await app.openCatalog();

      const catalogCount = await catalog.getItemCount();
      catalogIndex = catalogCount - 1; // mirrors inventory append

      await expect(catalog.itemName(catalogIndex)).toHaveText(newProductName);
      await expect(catalog.itemPriceValue(catalogIndex)).toHaveText(priceValue);
      await expect(catalog.itemQuantity(catalogIndex)).toHaveText("2 units");
      await expect(catalog.addToCartButton(catalogIndex)).toBeEnabled();
      await expect(catalog.addToCartButton(catalogIndex)).toHaveText(
        "Add to Cart"
      );
    });

    await test.step("decrease catalog stock to 0 by adding to cart", async () => {
      const catalog = new CatalogPage(page);
      await catalog.expectLoaded();

      // First click 1 unit left
      await catalog.clickAddToCart(catalogIndex);
      await expect(catalog.itemQuantity(catalogIndex)).toHaveText("1 units");
      await expect(catalog.addToCartButton(catalogIndex)).toBeEnabled();
      await expect(catalog.addToCartButton(catalogIndex)).toHaveText(
        "Add to Cart"
      );

      // Second click 0 units, should become Out of Stock
      await catalog.clickAddToCart(catalogIndex);

      await catalog.expectOutOfStock(catalogIndex);
    });

    await test.step("inventory stock is updated to 0 as well", async () => {
      const inventory: InventoryPage = await app.openInventory();

      // We reuse the same index where the product was created
      const qty = await inventory.getProductQuantityNumber(inventoryIndex);
      expect(qty).toBe(0);
      await expect(inventory.productQuantity(inventoryIndex)).toHaveText("0");
    });
  });
});
