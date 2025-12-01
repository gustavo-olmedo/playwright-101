# Playwright 101

This repository is a **monorepo** that combines:

- **`playground-project`** – A Next.js web application (Automation Test Playground) used as a demo app for practicing test automation.
- **`playwright-tests`** – A Playwright project containing automated end-to-end and flow tests targeting the playground app.

The idea is to have a single repository where the **application under test** and the **test suite** live together.

---

## Repository Structure

```text
.
├─ playground-project/   # Next.js app (Automation Test Playground)
│  ├─ app/
│  ├─ public/
│  ├─ package.json
│  └─ ...
│
├─ playwright-tests/     # Playwright tests (Playwright 101)
│  ├─ pages/
│  ├─ helpers/
│  ├─ tests/
│  ├─ playwright.config.ts
│  ├─ package.json
│  └─ README.md
│
├─ .gitignore
└─ README.md             # This file
```

For more details about the test project itself, see:

- [`playwright-tests/README.md`](./playwright-tests/README.md)

---

## Projects

### `playground-project` (Automation Test Playground)

A Next.js application that exposes different pages, flows, and UI elements designed to be automated.  
In this monorepo, it acts as the **system under test** for the Playwright suite.

Key technologies:

- Next.js
- React
- TypeScript
- Tailwind CSS
- Jest + Testing Library
- Deployed with Vercel (optional)

### `playwright-tests` (Playwright 101)

A Playwright project focused on:

- Page Object Model (POM) classes
- Page-focused tests (Home, Inventory, Catalog, Cart, Payment, Orders)
- Behavioural / end-to-end flows that span multiple pages

The goal is to learn and practice Playwright using the `playground-project` app.

---

## Getting Started

### 1. Install Dependencies

#### Option A – Manual (no extra tools)

From the repo root:

```bash
# Install dependencies for the Next.js app
cd playground-project
npm install

# Install dependencies for the Playwright tests
cd ../playwright-tests
npm install
npx playwright install
```

#### Option B – Using a Makefile

From the repo root:

```bash
make setup
```

This will:

- Run `npm install` in `playground-project`
- Run `npm install` in `playwright-tests`

## Running the Next.js App (`playground-project`)

From the repo root:

```bash
cd playground-project
npm run dev
```

Then open:

- <http://localhost:3000>

The app will auto-reload as you change the source files (e.g. `app/page.tsx`).

If you are using a `Makefile` with the `dev-playground` target, you can also run:

```bash
make dev-playground
```

---

## Running Playwright Tests (`playwright-tests`)

From the repo root:

```bash
cd playwright-tests
npm test
```

Or, using the scripts defined in `playwright-tests/package.json`:

```bash
# Full suite
npm test

# Playwright UI
npm run test:ui

# Headed mode
npm run test:headed

# Only Store page-level specs
npm run test:store:pages

# Only Store flow / E2E specs
npm run test:store:flows

# Debug with Playwright inspector
npm run test:debug
```

You can also run from the root:

```bash
make test-playwright
```

---

## Typical Workflow

1. **Start the app**

   ```bash
   cd playground-project
   npm run dev
   ```

2. **In another terminal, run tests**

   ```bash
   cd playwright-tests
   npm test
   ```

3. Iterate on:
   - UI and behaviour in `playground-project`
   - Page objects, helpers, and tests in `playwright-tests`
