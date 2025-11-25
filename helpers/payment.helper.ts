import { Page, expect } from "@playwright/test";
import { StoreApp } from "../pages/StoreApp";
import { PaymentPage } from "../pages/PaymentPage";

export async function addToCartFromCatalog(
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

export async function setupPaymentWithItems(page: Page): Promise<PaymentPage> {
  const app = new StoreApp(page);

  await app.openCatalog();
  await addToCartFromCatalog(page, "Giant Rubber Duck", 1);

  const cart = await app.openCart();

  await cart.goToPaymentsAndWait();

  const payment = new PaymentPage(page);
  await payment.expectLoaded();
  return payment;
}
