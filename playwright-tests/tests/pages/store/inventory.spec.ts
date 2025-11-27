import { test, expect } from "@playwright/test";
import { StoreApp } from "../../../pages/StoreApp";
import { InventoryPage } from "../../../pages/InventoryPage";

test.describe("Store - Inventory", () => {
  test.beforeEach(async ({ page }) => {
    const app = new StoreApp(page);
    await app.goto();
    await app.openInventory();
  });

  test("renders inventory layout with form and initial product list", async ({
    page,
  }) => {
    const inventory = new InventoryPage(page);

    await test.step("shows inventory container and title", async () => {
      await inventory.expectContainerAndTitle();
    });

    await test.step("shows form with three inputs", async () => {
      await inventory.expectFormWithInputs();
    });

    await test.step("shows submit button", async () => {
      await inventory.expectSubmitButton("Add Product");
    });

    await test.step("shows initial product list", async () => {
      await inventory.expectInitialProductListNotEmpty();
    });
  });

  test("shows alert if form is submitted with empty inputs", async ({
    page,
  }) => {
    const inventory = new InventoryPage(page);

    await inventory.submitExpectAlert("Please fill in all fields!", {
      soft: true,
    });
  });

  test("shows alert if any required field is missing", async ({ page }) => {
    const inventory = new InventoryPage(page);

    await inventory.fillProductForm({
      name: "Test Product",
      price: "10.5",
      // quantity intentionally missing
    });

    const dialogMessage = await inventory.submitAndCaptureAlertMessage();

    await test.step("verifies same alert is shown", async () => {
      expect.soft(dialogMessage).toBe("Please fill in all fields!");
    });
  });

  test("adds a new product in the list", async ({ page }) => {
    const inventory = new InventoryPage(page);

    const initialCount = await inventory.getProductCount();

    const newProductName = "Playwright Test Product";
    const priceInputValue = "23.23";
    const quantityInputValue = "22.9"; // decimals accepted but displayed as integer

    await test.step("fills all form fields", async () => {
      await inventory.fillProductForm({
        name: newProductName,
        price: priceInputValue,
        quantity: quantityInputValue,
      });
    });

    await test.step("submits the form and appends product to the list", async () => {
      await inventory.submitButton.click();

      const newProduct = inventory.productRow(initialCount);
      await expect(newProduct).toBeVisible();
    });

    await test.step("validates product name and price", async () => {
      await expect(inventory.productName(initialCount)).toHaveText(
        newProductName
      );

      await expect(inventory.productPriceLabel(initialCount)).toHaveText(
        "Price: €"
      );
      await expect(inventory.productPriceValue(initialCount)).toHaveText(
        priceInputValue
      ); // decimals preserved for price
    });

    await test.step("validates integer-only quantity display", async () => {
      await expect(inventory.productQuantity(initialCount)).toHaveText("22");
    });

    await test.step("new product has working + and - buttons", async () => {
      const originalQuantity = await inventory.getProductQuantityNumber(
        initialCount
      );

      await inventory.clickIncrease(initialCount);
      await expect(inventory.productQuantity(initialCount)).toHaveText(
        String(originalQuantity + 1)
      );

      await inventory.clickDecrease(initialCount);
      await expect(inventory.productQuantity(initialCount)).toHaveText(
        String(originalQuantity)
      );
    });
  });

  test("increments and decrements quantity for an existing product", async ({
    page,
  }) => {
    const inventory = new InventoryPage(page);
    const firstProductIndex = 0;

    const initialQuantity = await inventory.getProductQuantityNumber(
      firstProductIndex
    );

    await test.step("increments quantity by 1 when clicking +", async () => {
      await inventory.clickIncrease(firstProductIndex);
      await expect(inventory.productQuantity(firstProductIndex)).toHaveText(
        String(initialQuantity + 1)
      );
    });

    await test.step("decrements quantity by 1 when clicking -", async () => {
      await inventory.clickDecrease(firstProductIndex);
      await expect(inventory.productQuantity(firstProductIndex)).toHaveText(
        String(initialQuantity)
      );
    });
  });

  test("does not go below 0 when decreasing quantity (uses a product with 0 quantity)", async ({
    page,
  }) => {
    const inventory = new InventoryPage(page);

    // product-6 starts at 0 so we use that
    const zeroQtyIndex = 6;

    await test.step("ensures starting quantity is 0", async () => {
      await expect(inventory.productQuantity(zeroQtyIndex)).toHaveText("0");
    });

    await test.step("clicks - and keeps quantity at 0", async () => {
      await inventory.clickDecrease(zeroQtyIndex);
      await expect(inventory.productQuantity(zeroQtyIndex)).toHaveText("0");
    });
  });

  test("price and quantity inputs accept decimal values", async ({ page }) => {
    const inventory = new InventoryPage(page);

    await test.step("fills decimal values in numeric inputs", async () => {
      await inventory.setPriceInput("12.34");
      await inventory.setQuantityInput("5.67");
    });

    await test.step("checks that the raw input values include decimals", async () => {
      await inventory.expectPriceInputValue("12.34");

      const quantityValue = await inventory.getQuantityInputRawValue();
      expect(quantityValue).toContain(".");
    });
  });
});
