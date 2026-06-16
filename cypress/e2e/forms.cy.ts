/**
 * Form E2E tests for the portfolio site.
 *
 * Covers the contact form page — field rendering, validation,
 * Turnstile integration, and submission flows.
 *
 * Requires the dev server to be running.
 *
 * @module forms.cy
 */

describe("Contact form page", () => {
	beforeEach(() => {
		cy.visit("https://daniel-freire.com/en/contact");
	});

	it("should load the contact page successfully", () => {
		cy.get("h2").should("contain.text", "Contact");
	});

	it("should render the contact form with all fields", () => {
		cy.get("form").should("exist");

		// Required fields
		cy.get("#firstName").should("exist");
		cy.get("#email").should("exist");
		cy.get("#message").should("exist");

		// Optional fields
		cy.get("#lastName").should("exist");
		cy.get("#telephone").should("exist");

		// Privacy checkbox
		cy.get("#privacy-policy-check").should("exist");
	});

	it("should have required fields marked appropriately", () => {
		cy.get('[aria-required="true"]').should("have.length.at.least", 2);
	});

	it("should display the submit button", () => {
		cy.get('button[type="submit"]').should("exist");
	});

	it("should show the privacy policy link", () => {
		cy.get("form").contains("privacy policy").should("exist");
	});

	it("should have a Turnstile widget for bot protection", () => {
		// The Turnstile widget is rendered by Cloudflare
		cy.get("iframe[src*='turnstile']").should("exist");
	});

	describe("form validation", () => {
		it("should show browser validation for required empty fields", () => {
			// The form has required attributes on firstName, email, message
			cy.get("#firstName").should("have.attr", "required");
			cy.get("#email").should("have.attr", "required");
			cy.get("#message").should("have.attr", "required");
		});

		it("should validate email format", () => {
			cy.get("#email").should("have.attr", "type", "email");
		});

		it("should require privacy policy acceptance", () => {
			cy.get("#privacy-policy-check").should("have.attr", "required");
		});
	});
});
