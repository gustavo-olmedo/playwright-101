import { Page } from "@playwright/test";
import { HomePage } from "./HomePage";
import { InventoryPage } from "./InventoryPage";
import { CatalogPage } from "./CatalogPage";
import { CartPage } from "./CartPage";

const STORE_URL = "/store";

export class StoreApp {
  constructor(public readonly page: Page) {}

  async goto() {
    await this.page.goto(STORE_URL);
  }

  private get homeNav() {
    return this.page.getByTestId("store-tab-home");
  }

  private get inventoryNav() {
    return this.page.getByTestId("store-tab-inventory");
  }

  private get catalogNav() {
    return this.page.getByTestId("store-tab-catalog");
  }

  private get cartNav() {
    return this.page.getByTestId("store-tab-cart");
  }

  async openHome() {
    await this.homeNav.click();
    const page = new HomePage(this.page);
    await page.expectLoaded();
    return page;
  }

  async openInventory() {
    await this.inventoryNav.click();
    const page = new InventoryPage(this.page);
    await page.expectLoaded();
    return page;
  }

  async openCatalog() {
    await this.catalogNav.click();
    const page = new CatalogPage(this.page);
    await page.expectLoaded();
    return page;
  }

  async openCart() {
    await this.cartNav.click();
    const page = new CartPage(this.page);
    await page.expectLoaded();
    return page;
  }
}
