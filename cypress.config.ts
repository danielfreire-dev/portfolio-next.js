import { defineConfig } from "cypress";

/**
 * Cypress configuration for E2E testing.
 *
 * Defines the E2E test runner settings, including a plugin event handler
 * that registers the `cypress-accessibility-checker` plugin for automated
 * accessibility audits during tests.
 */
export default defineConfig({
  e2e: {
    /**
     * Registers Node event listeners for Cypress plugins.
     * @param on - Cypress event registration function
     * @param config - Cypress configuration object
     */
    setupNodeEvents(on, config) {
      on("task", {
        // Register the accessibility checker plugin as a Cypress task
        accessibilityChecker: require("cypress-accessibility-checker/plugin"),
      });
    },
  },
});
