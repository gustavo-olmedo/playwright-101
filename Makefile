.PHONY: default run-all setup setup-playground setup-playwright dev-playground test-playwright test-playwright-ui

default: run-all

run-all: setup
	@echo "▶ Starting Next.js app and running Playwright tests..."
	# Start Next.js dev server in background
	cd playground-project && npm run dev & \
	APP_PID=$$!; \
	echo "Next.js dev server PID: $$APP_PID"; \
	\
	echo "⏳ Waiting for http://localhost:3000 to be ready..."; \
	for i in $$(seq 1 60); do \
	  if curl -sSf http://localhost:3000 > /dev/null 2>&1; then \
	    echo "✅ App is up!"; \
	    break; \
	  fi; \
	  echo "Still waiting... ($$i)"; \
	  sleep 1; \
	  if [ $$i -eq 60 ]; then \
	    echo "❌ App did not start in time"; \
	    kill $$APP_PID || true; \
	    exit 1; \
	  fi; \
	done; \
	\
	echo "▶ Running Playwright tests..."; \
	cd playwright-tests && npx playwright test; \
	TEST_EXIT=$$?; \
	\
	echo "⏹ Stopping Next.js dev server..."; \
	kill $$APP_PID || true; \
	exit $$TEST_EXIT

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
