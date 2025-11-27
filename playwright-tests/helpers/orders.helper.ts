import { Page, expect } from "@playwright/test";
import { StoreApp } from "../pages/StoreApp";
import { OrdersPage } from "../pages/OrdersPage";

export async function addToCartFromCatalog(
  page: Page,
  productName: string,
  times = 1
) {
  const list = page.getByTestId("catalog-list");
  const items = list.locator('[data-testid^="catalog-item-"]');
  const count = await items.count();

  let targetIndex: number | null = null;

  for (let i = 0; i < count; i++) {
    const nameLocator = page.getByTestId(`catalog-item-name-${i}`);
    const nameText = (await nameLocator.textContent())?.trim();
    if (nameText === productName) {
      targetIndex = i;
      break;
    }
  }

  expect(targetIndex).not.toBeNull();
  const index = targetIndex as number;

  const button = page.getByTestId(`catalog-item-add-button-${index}`);

  for (let t = 0; t < times; t++) {
    await expect(button).toBeEnabled();
    await button.click();
  }
}

export async function createSingleOrder(
  page: Page,
  paymentMethodId = "Visa"
): Promise<OrdersPage> {
  const app = new StoreApp(page);

  await app.openCatalog();
  await addToCartFromCatalog(page, "Giant Rubber Duck", 1);

  await app.openCart();
  const goToPaymentButton = page.getByTestId("cart-go-to-payment");
  await expect(goToPaymentButton).toBeVisible();
  await goToPaymentButton.click();
  await expect(page.getByTestId("payment-page")).toBeVisible();

  const methodInput = page.getByTestId(
    `payment-method-input-${paymentMethodId}`
  );
  await methodInput.check();
  await expect(methodInput).toBeChecked();

  const confirmButton = page.getByTestId("payment-confirm-button");
  await confirmButton.click();

  const orders = new OrdersPage(page);
  await orders.expectLoaded();
  return orders;
}
