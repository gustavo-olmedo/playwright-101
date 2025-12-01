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

## Using the Makefile (One-Command Flow)

The repository includes a `Makefile` at the root that orchestrates everything.

From the repo root, you can simply run:

```bash
make
```

This will:

1. Install dependencies in **`playground-project`** and **`playwright-tests`**.
2. Build and start the **Next.js** app (`playground-project`) on `http://localhost:3000`.
3. Wait until the app is reachable.
4. Run the **Playwright tests** from `playwright-tests` against the running app.
5. Stop the Next.js dev server once tests finish.

So for the most common case (setup + run app + run tests), **`make` is all you need**.

### Other Makefile targets

If you want more control, you can also use the individual targets:

```bash
# Install dependencies in both projects
make setup

# Run only the Next.js app (dev server)
make dev-playground

# Run only the Playwright tests
make test-playwright

# Run Playwright tests in UI mode
make test-playwright-ui
```

---

## Getting Started (Manual Alternative)

If you prefer not to use `make`, you can run everything manually.

### 1. Install Dependencies

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

---

## Running the Next.js App (`playground-project`)

From the repo root:

```bash
cd playground-project
npm run dev
```

Then open:

- <http://localhost:3000>

The app will auto-reload as you change the source files (e.g. `app/page.tsx`).

If you are using the Makefile, you can instead run:

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

You can also run from the root via the Makefile:

```bash
make test-playwright
```
