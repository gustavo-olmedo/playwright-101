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
});
