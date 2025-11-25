import { Page } from "@playwright/test";
import { HomePage } from "./HomePage";
import { InventoryPage } from "./InventoryPage";

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
}
