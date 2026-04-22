// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

/**
 * Cypress E2E support entry point.
 *
 * Imports custom commands defined in `commands.ts` so they are
 * available globally across all test files. Additional global
 * setup (e.g. accessibility checker) can be uncommented below.
 */

// Import custom commands (metatag, etc.) so they are available in every test
import "./commands";

// Uncomment to enable the accessibility checker plugin globally:
// import "cypress-accessibility-checker";
