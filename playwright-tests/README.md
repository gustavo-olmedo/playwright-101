# Playwright tests

This project contains automated tests using Playwright, structured around:

- Page Object Model (POM) classes
- Page-level tests (per section: Home, Inventory, Catalog, Cart, Payment, Orders)
- Behavioural / end-to-end flows that connect multiple pages

The goal is to learn about the framework.

---

## Project Structure

```text
.
├─ pages/
│  ├─ HomePage.ts
│  ├─ InventoryPage.ts
│  ├─ CatalogPage.ts
│  ├─ CartPage.ts
│  ├─ PaymentPage.ts
│  ├─ OrdersPage.ts
│  └─ StoreApp.ts
│
├─ helpers/
│  ├─ payment.helper.ts
│  └─ orders.helper.ts
│
├─ tests/
│  ├─ pages/
│  │  └─ store/
│  │     ├─ home.spec.ts
│  │     ├─ inventory.spec.ts
│  │     ├─ catalog.spec.ts
│  │     ├─ cart.spec.ts
│  │     ├─ payment.spec.ts
│  │     └─ orders.spec.ts
│  │
│  └─ flows/
│     └─ store/
│        ├─ basic-single-product-purchase.spec.ts
│        ├─ multi-product-purchase-with-totals.spec.ts
│        └─ inventory-catalog-out-of-stock.spec.ts
│
├─ playwright.config.ts
└─ package.json
```

- `tests/pages/store` → page-focused tests
- `tests/flows/store` → behavioural / cross-page flows

---

## Page Object Model (POM)

All page objects live under `pages/`.

## Helpers

Helpers live under `helpers/` and encapsulate repeated cross-page actions.

## Test Types

### 1) Page tests (`tests/pages/store/*.spec.ts`)

These focus on one page at a time and use the POM for that page:

- `home.spec.ts`
  - Verifies Instructions layout, description, and section order
- `inventory.spec.ts`
  - Inventory layout, validation, adding products, quantity controls, and decimal handling
- `catalog.spec.ts`
  - Catalog layout, item structure, in-stock / out-of-stock rules, sync with Inventory
- `cart.spec.ts`
  - Empty vs non-empty cart, row totals, cart total, “Go to Payments”
- `payment.spec.ts`
  - Empty state, payment summary, item totals, match with Cart, payment methods, navigation to Orders
- `orders.spec.ts`
  - Empty state, orders list, order total vs item totals, date/payment format, creating an order from Payment and verifying it in history

### 2) Flow / E2E tests (`tests/flows/store/*.spec.ts`)

These tests simulate real user journeys across multiple pages:

- `basic-single-product-purchase.spec.ts`  
  Single product purchase end-to-end: Catalog → Cart → Payment → Orders.

- `multi-product-purchase-with-totals.spec.ts`  
  Multi-product, multi-quantity purchase and total verification across Cart & Payment.

- `inventory-catalog-out-of-stock.spec.ts`  
  Adjust inventory, verify Catalog stock, and drive an item to “Out of Stock”.

---

## NPM Scripts

In `package.json` you can define the following scripts:

```json
"scripts": {
  "test": "npx playwright test",
  "test:ui": "npx playwright test --ui",
  "test:headed": "npx playwright test --headed",
  "test:store:pages": "npx playwright test tests/pages/store",
  "test:store:flows": "npx playwright test tests/flows/store",
  "test:debug": "PWDEBUG=1 npx playwright test"
}
```

Notes:

- `test` – runs the whole suite headless.
- `test:ui` – opens the Playwright Test Runner UI.
- `test:headed` – runs tests with a visible browser (useful while iterating).
- `test:store:pages` – only Store page-level specs.
- `test:store:flows` – only Store flow / E2E specs.
- `test:debug` – runs tests with `PWDEBUG=1` enabled (Playwright inspector).

---

## How to Run Tests

Install dependencies (once):

```bash
npm install
npx playwright install
```

Run the whole suite:

```bash
npm test
```

Open the Playwright UI:

```bash
npm run test:ui
```

Run only Store page tests:

```bash
npm run test:store:pages
```

Run only Store flow / E2E tests:

```bash
npm run test:store:flows
```

Run tests headed:

```bash
npm run test:headed
```

Debug with the Playwright inspector:

```bash
npm run test:debug
```
