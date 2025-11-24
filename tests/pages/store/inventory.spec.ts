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

  test("adds a new product in the list", async ({ page }) => {
    const list = page.getByTestId("inventory-product-list");
    const products = list.locator('li[data-testid^="inventory-product-"]');
    const initialCount = await products.count();

    const newProductName = "Playwright Test Product";
    const priceInputValue = "23.23";
    const quantityInputValue = "22.9"; // decimals should be accepted but stored as integer

    await test.step("fills all form fields", async () => {
      await page.getByTestId("inventory-input-name").fill(newProductName);
      await page.getByTestId("inventory-input-price").fill(priceInputValue);
      await page
        .getByTestId("inventory-input-quantity")
        .fill(quantityInputValue);
    });

    await test.step("submits the form and appends product to the list", async () => {
      await page.getByTestId("inventory-submit-button").click();

      // New product should appear at the end (index = initialCount)
      const newProduct = page.getByTestId(`inventory-product-${initialCount}`);
      await expect(newProduct).toBeVisible();
    });

    await test.step("validates product name and price", async () => {
      const nameLocator = page.getByTestId(
        `inventory-product-name-${initialCount}`
      );
      await expect(nameLocator).toHaveText(newProductName);

      const priceLabel = page.getByTestId(
        `inventory-product-price-label-${initialCount}`
      );
      const priceValue = page.getByTestId(
        `inventory-product-price-value-${initialCount}`
      );

      await expect(priceLabel).toHaveText("Price: €");
      await expect(priceValue).toHaveText(priceInputValue); // decimals preserved for price
    });

    await test.step("validates integer-only quantity display", async () => {
      const qtyLocator = page.getByTestId(
        `inventory-product-quantity-${initialCount}`
      );
      await expect(qtyLocator).toHaveText("22");
    });

    await test.step("new product has working + and - buttons", async () => {
      const qtyLocator = page.getByTestId(
        `inventory-product-quantity-${initialCount}`
      );
      const increaseButton = page.getByTestId(
        `inventory-product-increase-${initialCount}`
      );
      const decreaseButton = page.getByTestId(
        `inventory-product-decrease-${initialCount}`
      );

      await expect(increaseButton).toBeVisible();
      await expect(decreaseButton).toBeVisible();

      const originalQuantity = parseInt(
        (await qtyLocator.textContent()) || "0",
        10
      );

      await increaseButton.click();
      await expect(qtyLocator).toHaveText(String(originalQuantity + 1));

      await decreaseButton.click();
      await expect(qtyLocator).toHaveText(String(originalQuantity));
    });
  });

  test("increments and decrements quantity for an existing product", async ({
    page,
  }) => {
    const firstProductIndex = 0; // We will pick the first item

    const qtyLocator = page.getByTestId(
      `inventory-product-quantity-${firstProductIndex}`
    );
    const increaseButton = page.getByTestId(
      `inventory-product-increase-${firstProductIndex}`
    );
    const decreaseButton = page.getByTestId(
      `inventory-product-decrease-${firstProductIndex}`
    );

    const initialQuantityText = await qtyLocator.textContent();
    const initialQuantity = parseInt(initialQuantityText || "0", 10);

    await test.step("increments quantity by 1 when clicking +", async () => {
      await increaseButton.click();
      await expect(qtyLocator).toHaveText(String(initialQuantity + 1));
    });

    await test.step("decrements quantity by 1 when clicking -", async () => {
      await decreaseButton.click();
      await expect(qtyLocator).toHaveText(String(initialQuantity));
    });
  });

  test("does not go below 0 when decreasing quantity (uses a product with 0 quantity)", async ({
    page,
  }) => {
    // In your sample HTML, product-6 (Invisible Pen) starts at 0
    const zeroQtyIndex = 6;

    const qtyLocator = page.getByTestId(
      `inventory-product-quantity-${zeroQtyIndex}`
    );
    const decreaseButton = page.getByTestId(
      `inventory-product-decrease-${zeroQtyIndex}`
    );

    await test.step("ensures starting quantity is 0", async () => {
      await expect(qtyLocator).toHaveText("0");
    });

    await test.step("clicks - and keeps quantity at 0", async () => {
      await decreaseButton.click();
      await expect(qtyLocator).toHaveText("0");
    });
  });
});
