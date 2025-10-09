describe("English Metadata", () => {
	cy.visit("http://daniel-freire.com/en");

	it("multi-page testing", () => {
		cy.title().should("include", "Homepage | Daniel Freire");
		cy.get('body meta[name="description"]').should(
			"have.attr",
			"content",
			"Daniel's Introduction",
		);
		cy.get('body meta[name="description"]').should(
			"have.attr",
			"content",
			"Daniel's Introduction",
		);
		cy.get('body meta[name="author"]').should(
			"have.attr",
			"content",
			"Daniel Freire",
		);
		cy.get('body meta[name="creator"]').should(
			"have.attr",
			"content",
			"Daniel Freire",
		);
	});
});
