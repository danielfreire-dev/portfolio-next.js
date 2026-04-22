/**
 * Form E2E tests for the portfolio site.
 *
 * Covers the contact form page — currently a basic smoke test that
 * verifies the page is reachable. Expand with assertions for form
 * fields, validation messages, and successful submission flows.
 *
 * @module forms.cy
 */

describe("Contact form page", () => {
  it("should load the contact page successfully", () => {
    // Visit the contact page and verify it renders without errors
    cy.visit("https://daniel-freire.com/en/contact");
  });
});
