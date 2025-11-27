import { test, expect } from "@playwright/test";
import { StoreApp } from "../../../pages/StoreApp";
import { InventoryPage } from "../../../pages/InventoryPage";
import { CatalogPage } from "../../../pages/CatalogPage";
import { CartPage } from "../../../pages/CartPage";
import { PaymentPage } from "../../../pages/PaymentPage";
import { OrdersPage } from "../../../pages/OrdersPage";

test.describe("Store - Basic single-product purchase", () => {
  test("user can create a product, buy it, and see it in Orders", async ({
    page,
  }) => {
    const app = new StoreApp(page);
    await app.goto();

    const productName = "E2E Flow Product";
    const priceValue = "19.99";
    const quantityValue = "3";

    let createdInventoryIndex: number;
    await test.step("create a new product in Inventory", async () => {
      const inventory: InventoryPage = await app.openInventory();
      await inventory.expectContainerAndTitle();
      await inventory.expectFormWithInputs();
      await inventory.expectSubmitButton();

      const initialCount = await inventory.getProductCount();

      await inventory.addProduct(productName, priceValue, quantityValue);

      const newCount = await inventory.getProductCount();
      expect(newCount).toBe(initialCount + 1);

      createdInventoryIndex = newCount - 1;

      await expect(inventory.productName(createdInventoryIndex)).toHaveText(
        productName
      );
      await expect(
        inventory.productPriceValue(createdInventoryIndex)
      ).toHaveText(priceValue);
      await expect(inventory.productQuantity(createdInventoryIndex)).toHaveText(
        "3"
      );
    });

    let catalogIndex: number;
    let catalogQuantityBefore: number;
    await test.step("see the product in Catalog with same price and quantity", async () => {
      const catalog: CatalogPage = await app.openCatalog();
      await catalog.expectContainerAndTitle();
      await catalog.expectListHasItems();

      const foundIndex = await catalog.findItemIndexByName(productName);
      expect(foundIndex).not.toBeNull();
      catalogIndex = foundIndex as number;

      await expect(catalog.itemName(catalogIndex)).toHaveText(productName);
      await expect(catalog.itemPriceValue(catalogIndex)).toHaveText(priceValue);
      await catalog.expectInStock(catalogIndex, 3);

      catalogQuantityBefore = await catalog.getItemQuantityNumber(catalogIndex);
      expect(catalogQuantityBefore).toBe(3);
    });

    await test.step("add one unit to cart from Catalog", async () => {
      const catalog = new CatalogPage(page);
      await catalog.clickAddToCart(catalogIndex);

      await expect(catalog.itemQuantity(catalogIndex)).toHaveText("2 units");
      const qtyAfter = await catalog.getItemQuantityNumber(catalogIndex);
      expect(qtyAfter).toBe(catalogQuantityBefore - 1);
    });

    let cartIndex: number;
    let unitPriceNumber: number;
    await test.step("verify product appears in Cart with correct totals", async () => {
      const cart: CartPage = await app.openCart();
      await cart.expectLoaded();
      await cart.expectNotEmpty();

      const foundIndex = await cart.findItemIndexByName(productName);
      expect(foundIndex).not.toBeNull();
      cartIndex = foundIndex as number;

      await expect(cart.itemName(cartIndex)).toHaveText(productName);
      await expect(cart.itemQuantity(cartIndex)).toHaveText("1");
      await expect(cart.itemPriceValue(cartIndex)).toHaveText(priceValue);

      const rowTotal = await cart.getItemRowTotalNumber(cartIndex);
      unitPriceNumber = await cart.getItemPriceNumber(cartIndex);

      expect(rowTotal).toBe(unitPriceNumber);

      const cartTotal = await cart.getCartTotalNumber();
      expect(cartTotal).toBe(unitPriceNumber);
    });

    let paymentItemIndex = 0;
    let paymentTotal: number;
    await test.step("go to Payment and check summary & total", async () => {
      const cart = new CartPage(page);
      await cart.goToPaymentsAndWait();

      const payment = new PaymentPage(page);
      await payment.expectLoaded();
      await payment.expectHasItemsAndSummary();

      const itemCount = await payment.getItemCount();
      expect(itemCount).toBeGreaterThan(0);

      // We assume our product is the first payment item
      await payment.expectItemStructure(paymentItemIndex);
      await expect(payment.itemName(paymentItemIndex)).toHaveText(productName);

      const qty = await payment.getItemQuantityNumber(paymentItemIndex);
      const price = await payment.getItemPriceNumber(paymentItemIndex);
      const rowTotal = await payment.getItemRowTotalNumber(paymentItemIndex);

      expect(qty).toBe(1);
      expect(price).toBe(unitPriceNumber);
      expect(rowTotal).toBe(unitPriceNumber);

      paymentTotal = await payment.getPaymentTotalNumber();
      expect(paymentTotal).toBe(unitPriceNumber);
    });

    await test.step("select payment method and confirm", async () => {
      const payment = new PaymentPage(page);
      await payment.selectMethod("Visa");
      await payment.confirmPayment();

      const orders = new OrdersPage(page);
      await orders.expectLoaded();
    });

    await test.step("verify new order appears with correct data", async () => {
      const orders = new OrdersPage(page);

      const orderCount = await orders.getOrderCount();
      expect(orderCount).toBe(1);

      const orderIndex = 0;

      // Date & payment method sanity
      await orders.expectDateAndPaymentValid(orderIndex, [
        "MBWay",
        "Klarna",
        "Multibanco",
        "PayPal",
        "Visa",
      ]);

      const orderTotal = await orders.getOrderTotalNumber(orderIndex);
      expect(orderTotal).toBe(paymentTotal);

      const itemsCount = await orders.getOrderItemsCount(orderIndex);
      expect(itemsCount).toBe(1);

      const orderItemNameText =
        (await orders.orderItemName(orderIndex, 0).textContent())?.trim() ?? "";
      const orderItemTotal = await orders.getOrderItemTotalNumber(
        orderIndex,
        0
      );

      // "<quantity> x <name>" format like in the html
      const expectedName = `1 x ${productName}`;
      expect(orderItemNameText).toBe(expectedName);
      expect(orderItemTotal).toBe(paymentTotal);

      // totals per order match sum of items
      await orders.expectOrderTotalsMatchItems(orderIndex);
    });
  });
});
