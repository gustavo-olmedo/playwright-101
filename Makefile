.PHONY: setup setup-playground setup-playwright dev-playground test-playwright test-playwright-ui

# Install dependencies in both projects
setup: setup-playground setup-playwright

setup-playground:
	cd playground-project && npm install

setup-playwright:
	cd playwright-tests && npm install

# Run the Next.js playground app
dev-playground:
	cd playground-project && npm run dev

# Run Playwright tests
test-playwright:
	cd playwright-tests && npx playwright test

# Run Playwright in UI mode
test-playwright-ui:
	cd playwright-tests && npx playwright test --ui
