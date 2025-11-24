import { test, expect } from "@playwright/test";

test.describe("Store - Home", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/store");
  });

  test("renders main instructions layout", async ({ page }) => {
    await test.step("shows intructions container", async () => {
      const container = page.getByTestId("instructions-page");
      await expect(container).toBeVisible();
    });

    await test.step("shows main header", async () => {
      const header = page.getByTestId("instructions-title");
      await expect(header).toBeVisible();
      await expect(header).toHaveText("Instructions");
    });

    await test.step("shows main description", async () => {
      const description = page.getByTestId("instructions-description");
      await expect(description).toBeVisible();
      await expect(description).toHaveText(
        "Learn how to make the most of all the features in our application with these quick and easy-to-follow instructions. Each section is designed to make your experience even better!"
      );
    });
  });

  test("displays all isntruction sections in the correct order", async ({
    page,
  }) => {
    const list = page.getByTestId("instructions-list");
    // Use css selector for the locator and get all sections
    const sections = await list
      .locator('> div[data-testid^="instructions-section-"]')
      .all();

    // I expect to have 5 sections
    expect(sections).toHaveLength(5);

    const expectedOrder = [
      "instructions-section-inventory",
      "instructions-section-catalog",
      "instructions-section-cart",
      "instructions-section-payment",
      "instructions-section-orders",
    ];

    const testIds = await Promise.all(
      sections.map((s) => s.getAttribute("data-testid"))
    );

    expect(testIds).toEqual(expectedOrder);
  });

  test.describe("Inventory section", () => {
    test("shows Inventory icon, title, and description", async ({ page }) => {
      const section = page.getByTestId("instructions-section-inventory");

      await test.step("section is visible", async () => {
        await expect(section).toBeVisible();
      });

      await test.step("icon is visible", async () => {
        await expect(
          page.getByTestId("instructions-icon-inventory")
        ).toBeVisible();
      });

      await test.step("title text is correct", async () => {
        const title = page.getByTestId("instructions-inventory-title");
        await expect(title).toBeVisible();
        await expect(title).toHaveText("Inventory");
      });

      await test.step("description text is correct", async () => {
        const text = page.getByTestId("instructions-inventory-text");
        await expect(text).toBeVisible();
        await expect(text).toHaveText(
          "Manage the store’s inventory and register new products by defining their name, price, and initial quantity."
        );
      });
    });
  });

  test.describe("Catalog section", () => {
    test("shows Catalog icon, title, and description", async ({ page }) => {
      const section = page.getByTestId("instructions-section-catalog");

      await test.step("section is visible", async () => {
        await expect(section).toBeVisible();
      });

      await test.step("icon is visible", async () => {
        await expect(
          page.getByTestId("instructions-icon-catalog")
        ).toBeVisible();
      });

      await test.step("title text is correct", async () => {
        const title = page.getByTestId("instructions-catalog-title");
        await expect(title).toBeVisible();
        await expect(title).toHaveText("Catalog");
      });

      await test.step("description text is correct", async () => {
        const text = page.getByTestId("instructions-catalog-text");
        await expect(text).toBeVisible();
        await expect(text).toHaveText(
          "Browse the available products, view details, and add them to your cart for purchase."
        );
      });
    });
  });

  test.describe("Cart section", () => {
    test("shows Cart icon, title, and description", async ({ page }) => {
      const section = page.getByTestId("instructions-section-cart");

      await test.step("section is visible", async () => {
        await expect(section).toBeVisible();
      });

      await test.step("icon is visible", async () => {
        await expect(page.getByTestId("instructions-icon-cart")).toBeVisible();
      });

      await test.step("title text is correct", async () => {
        const title = page.getByTestId("instructions-cart-title");
        await expect(title).toBeVisible();
        await expect(title).toHaveText("Cart");
      });

      await test.step("description text is correct", async () => {
        const text = page.getByTestId("instructions-cart-text");
        await expect(text).toBeVisible();
        await expect(text).toHaveText(
          "View the items you’ve added. Quantities can be updated only inside the Catalog. When ready, proceed to checkout."
        );
      });
    });
  });

  test.describe("Payment section", () => {
    test("shows Payment icon, title, and description", async ({ page }) => {
      const section = page.getByTestId("instructions-section-payment");

      await test.step("section is visible", async () => {
        await expect(section).toBeVisible();
      });

      await test.step("icon is visible", async () => {
        await expect(
          page.getByTestId("instructions-icon-payment")
        ).toBeVisible();
      });

      await test.step("title text is correct", async () => {
        const title = page.getByTestId("instructions-payment-title");
        await expect(title).toBeVisible();
        await expect(title).toHaveText("Payment");
      });

      await test.step("description text is correct", async () => {
        const text = page.getByTestId("instructions-payment-text");
        await expect(text).toBeVisible();
        await expect(text).toHaveText(
          "You’ll see a full summary of the cart items. Select a payment method to complete your purchase."
        );
      });
    });
  });

  test.describe("Orders section", () => {
    test("shows Orders icon, title, and description", async ({ page }) => {
      const section = page.getByTestId("instructions-section-orders");

      await test.step("section is visible", async () => {
        await expect(section).toBeVisible();
      });

      await test.step("icon is visible", async () => {
        await expect(
          page.getByTestId("instructions-icon-orders")
        ).toBeVisible();
      });

      await test.step("title text is correct", async () => {
        const title = page.getByTestId("instructions-orders-title");
        await expect(title).toBeVisible();
        await expect(title).toHaveText("Orders");
      });

      await test.step("description text is correct", async () => {
        const text = page.getByTestId("instructions-orders-text");
        await expect(text).toBeVisible();
        await expect(text).toHaveText(
          "Review your purchase history, including date, items, total, and payment method."
        );
      });
    });
  });
});
