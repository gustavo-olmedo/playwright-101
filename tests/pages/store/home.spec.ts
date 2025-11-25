import { test } from "@playwright/test";
import { StoreApp } from "../../../pages/StoreApp";
import { HomePage, SectionKey } from "../../../pages/HomePage";

test.describe("Store - Home", () => {
  test.beforeEach(async ({ page }) => {
    const app = new StoreApp(page);
    await app.goto();
    await app.openHome();
  });

  test("renders main instructions layout", async ({ page }) => {
    const home = new HomePage(page);

    await test.step("shows instructions container", async () => {
      await home.expectContainerVisible();
    });

    await test.step("shows main header", async () => {
      await home.expectTitleIsVisible("Instructions");
    });

    await test.step("shows main description", async () => {
      await home.expectDescriptionIsVisible(
        "Learn how to make the most of all the features in our application with these quick and easy-to-follow instructions. Each section is designed to make your experience even better!"
      );
    });
  });

  test("displays all instruction sections in the correct order", async ({
    page,
  }) => {
    const home = new HomePage(page);

    await home.expectSectionsCount(5);
    await home.expectSectionsOrder([
      "inventory",
      "catalog",
      "cart",
      "payment",
      "orders",
    ]);
  });

  const SECTION_EXPECTATIONS: Record<
    SectionKey,
    { title: string; description: string }
  > = {
    inventory: {
      title: "Inventory",
      description:
        "Manage the store’s inventory and register new products by defining their name, price, and initial quantity.",
    },
    catalog: {
      title: "Catalog",
      description:
        "Browse the available products, view details, and add them to your cart for purchase.",
    },
    cart: {
      title: "Cart",
      description:
        "View the items you’ve added. Quantities can be updated only inside the Catalog. When ready, proceed to checkout.",
    },
    payment: {
      title: "Payment",
      description:
        "You’ll see a full summary of the cart items. Select a payment method to complete your purchase.",
    },
    orders: {
      title: "Orders",
      description:
        "Review your purchase history, including date, items, total, and payment method.",
    },
  };

  test.describe("Instruction sections content", () => {
    for (const key of Object.keys(SECTION_EXPECTATIONS) as SectionKey[]) {
      const { title, description } = SECTION_EXPECTATIONS[key];

      test(`shows ${title} icon, title, and description`, async ({ page }) => {
        const home = new HomePage(page);

        await home.expectSectionAll(key, { title, description });
      });
    }
  });
});
