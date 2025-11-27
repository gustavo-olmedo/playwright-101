import { test, expect, Page } from "@playwright/test";
import { StoreApp } from "../../../pages/StoreApp";
import { CartPage } from "../../../pages/CartPage";

async function addToCartFromCatalog(
  page: Page,
  productName: string,
  times = 1
) {
  const app = new StoreApp(page);
  const catalog = await app.openCatalog();

  const index = await catalog.findItemIndexByName(productName);
  expect(index).not.toBeNull();
  const i = index as number;

  const button = catalog.addToCartButton(i);
  for (let t = 0; t < times; t++) {
    await expect(button).toBeEnabled();
    await catalog.clickAddToCart(i);
  }
}

test.describe("Store - Cart", () => {
  test.beforeEach(async ({ page }) => {
    const app = new StoreApp(page);
    await app.goto();
    await app.openCart();
  });

  test("cart shows empty message when there are no items", async ({ page }) => {
    const cart = new CartPage(page);

    await cart.expectEmpty("Your cart is empty.");
  });

  test("cart shows items and summary after adding from catalog", async ({
    page,
  }) => {
    const app = new StoreApp(page);

    await test.step("add one product from catalog", async () => {
      await addToCartFromCatalog(page, "Giant Rubber Duck", 1);
    });

    await test.step("open cart page", async () => {
      await app.openCart();
    });

    const cart = new CartPage(page);

    await test.step("empty message is not shown", async () => {
      await cart.expectNotEmpty();
    });

    await test.step("cart list has at least one item", async () => {
      const count = await cart.getItemCount();
      expect(count).toBeGreaterThan(0);
    });
  });

  test("each cart item total equals quantity × price", async ({ page }) => {
    const app = new StoreApp(page);

    await test.step("create a cart with two items from catalog", async () => {
      await addToCartFromCatalog(page, "Giant Rubber Duck", 1);
      await addToCartFromCatalog(page, "Bacon-Scented Candle", 1);
    });

    await app.openCart();
    const cart = new CartPage(page);

    const count = await cart.getItemCount();

    for (let i = 0; i < count; i++) {
      await test.step(`validates row total for cart item ${i}`, async () => {
        const quantity = await cart.getItemQuantityNumber(i);
        const price = await cart.getItemPriceNumber(i);
        const rowTotal = await cart.getItemRowTotalNumber(i);

        const expectedRowTotal = parseFloat((quantity * price).toFixed(2));
        expect(rowTotal).toBe(expectedRowTotal);
      });
    }
  });

  test("cart total equals sum of row totals", async ({ page }) => {
    const app = new StoreApp(page);

    await test.step("create a cart with two items from catalog", async () => {
      await addToCartFromCatalog(page, "Giant Rubber Duck", 1);
      await addToCartFromCatalog(page, "Bacon-Scented Candle", 1);
    });

    await app.openCart();
    const cart = new CartPage(page);

    const count = await cart.getItemCount();
    let sum = 0;

    for (let i = 0; i < count; i++) {
      const rowTotal = await cart.getItemRowTotalNumber(i);
      sum += rowTotal;
    }

    const cartTotal = await cart.getCartTotalNumber();
    const expectedSum = parseFloat(sum.toFixed(2));

    expect(cartTotal).toBe(expectedSum);
  });

  test("adding from catalog increases quantity and row total in cart", async ({
    page,
  }) => {
    const app = new StoreApp(page);
    const productName = "Giant Rubber Duck";

    let baseline: {
      index: number;
      quantity: number;
      price: number;
      rowTotal: number;
    };

    await test.step("start with a single unit of the product in cart", async () => {
      await addToCartFromCatalog(page, productName, 1);
      await app.openCart();

      const cart = new CartPage(page);
      const index = await cart.findItemIndexByName(productName);
      expect(index).not.toBeNull();
      const i = index as number;

      baseline = {
        index: i,
        quantity: await cart.getItemQuantityNumber(i),
        price: await cart.getItemPriceNumber(i),
        rowTotal: await cart.getItemRowTotalNumber(i),
      };

      expect(baseline.quantity).toBeGreaterThan(0);
    });

    await test.step("add one more unit from catalog", async () => {
      await addToCartFromCatalog(page, productName, 1);
    });

    await test.step("cart quantity and row total are updated", async () => {
      await app.openCart();
      const cart = new CartPage(page);

      const i = baseline.index;
      const quantityNow = await cart.getItemQuantityNumber(i);
      const rowTotalNow = await cart.getItemRowTotalNumber(i);

      expect(quantityNow).toBe(baseline.quantity + 1);

      const expectedRowTotal = parseFloat(
        (quantityNow * baseline.price).toFixed(2)
      );
      expect(rowTotalNow).toBe(expectedRowTotal);
    });
  });

  test("new product created in inventory can be added via catalog and appears in cart", async ({
    page,
  }) => {
    const app = new StoreApp(page);
    const productName = "Cart New Product";
    const priceValue = "7.77";
    const quantityValue = "4.2"; // inventory stores 4 units

    await test.step("create product in Inventory", async () => {
      const inventory = await app.openInventory();
      await inventory.addProduct(productName, priceValue, quantityValue);
    });

    await test.step("add product once from Catalog", async () => {
      await addToCartFromCatalog(page, productName, 1);
    });

    await test.step("cart contains new product with correct quantity, price, and row total", async () => {
      await app.openCart();
      const cart = new CartPage(page);

      const index = await cart.findItemIndexByName(productName);
      expect(index).not.toBeNull();
      const i = index as number;

      await expect(cart.itemName(i)).toHaveText(productName);
      await expect(cart.itemPriceValue(i)).toHaveText(priceValue);
      await expect(cart.itemQuantity(i)).toHaveText("1");

      const rowTotal = await cart.getItemRowTotalNumber(i);
      const expected = parseFloat(priceValue);

      expect(rowTotal).toBe(expected);
    });
  });

  test("go to Payments button navigates to Payments section when cart has items", async ({
    page,
  }) => {
    const app = new StoreApp(page);

    await test.step("add item to cart so summary and button exist", async () => {
      await addToCartFromCatalog(page, "Giant Rubber Duck", 1);
    });

    await app.openCart();
    const cart = new CartPage(page);

    await test.step("click Go to Payments and land on Payments page", async () => {
      await cart.goToPaymentsAndWait();
    });
  });
});
