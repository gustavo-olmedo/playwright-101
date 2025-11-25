import { Page, expect, Locator } from "@playwright/test";

// I'll use this to validate the sections as well
export type SectionKey =
  | "inventory"
  | "catalog"
  | "cart"
  | "payment"
  | "orders";

export class HomePage {
  readonly root: Locator;
  readonly title: Locator;
  readonly description: Locator;
  readonly sectionsList: Locator;

  constructor(public readonly page: Page) {
    this.root = page.getByTestId("instructions-page");
    this.title = page.getByTestId("instructions-title");
    this.description = page.getByTestId("instructions-description");
    this.sectionsList = page.getByTestId("instructions-list");
  }

  async expectLoaded() {
    await this.expectContainerVisible();
    await this.expectTitleIsVisible("Instructions");
  }

  async expectContainerVisible() {
    await expect(this.root).toBeVisible();
  }

  async expectTitleIsVisible(expectedText: string = "Instructions") {
    await expect(this.title).toBeVisible();
    await expect(this.title).toHaveText(expectedText);
  }

  async expectDescriptionIsVisible(expectedText: string) {
    await expect(this.description).toBeVisible();
    await expect(this.description).toHaveText(expectedText);
  }

  private sectionsLocator() {
    // direct children divs with data-testid starting with instructions-section-
    return this.sectionsList.locator(
      '> div[data-testid^="instructions-section-"]'
    );
  }

  async getSectionsCount() {
    return await this.sectionsLocator().count();
  }

  async expectSectionsCount(expected: number) {
    const count = await this.getSectionsCount();
    expect(count).toBe(expected);
  }

  async getSectionsTestIds(): Promise<(string | null)[]> {
    const sections = await this.sectionsLocator().all();
    return Promise.all(sections.map((s) => s.getAttribute("data-testid")));
  }

  async expectSectionsOrder(keys: SectionKey[]) {
    const expectedTestIds = keys.map((key) => `instructions-section-${key}`);
    const testIds = await this.getSectionsTestIds();
    expect(testIds).toEqual(expectedTestIds);
  }

  sectionContainer(key: SectionKey) {
    return this.page.getByTestId(`instructions-section-${key}`);
  }

  sectionTitle(key: SectionKey) {
    return this.page.getByTestId(`instructions-${key}-title`);
  }

  sectionText(key: SectionKey) {
    return this.page.getByTestId(`instructions-${key}-text`);
  }

  sectionIcon(key: SectionKey) {
    return this.page.getByTestId(`instructions-icon-${key}`);
  }

  async expectSectionContainerVisible(key: SectionKey) {
    await expect(this.sectionContainer(key)).toBeVisible();
  }

  async expectSectionIconVisible(key: SectionKey) {
    await expect(this.sectionIcon(key)).toBeVisible();
  }

  async expectSectionTitleEquals(key: SectionKey, expectedTitle: string) {
    await expect(this.sectionTitle(key)).toBeVisible();
    await expect(this.sectionTitle(key)).toHaveText(expectedTitle);
  }

  async expectSectionDescriptionEquals(
    key: SectionKey,
    expectedDescription: string
  ) {
    await expect(this.sectionText(key)).toBeVisible();
    await expect(this.sectionText(key)).toHaveText(expectedDescription);
  }

  async expectSectionAll(
    key: SectionKey,
    expected: { title: string; description: string }
  ) {
    await this.expectSectionContainerVisible(key);
    await this.expectSectionIconVisible(key);
    await this.expectSectionTitleEquals(key, expected.title);
    await this.expectSectionDescriptionEquals(key, expected.description);
  }
}
