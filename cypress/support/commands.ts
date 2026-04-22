/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

/**
 * Custom Cypress command: `metatag`
 *
 * Queries a `<meta>` element in the document `<head>` by matching both
 * the `name` and `content` attributes.
 *
 * @param metadata - The value of the `name` attribute (e.g. "description")
 * @param content  - The expected value of the `content` attribute
 * @returns The matching `<meta>` element wrapped in a Cypress chainable
 *
 * @example
 *   cy.metatag("description", "Daniel's Introduction")
 */
Cypress.Commands.add("metatag", (metadata: string, content: string) => {
  return cy.get(`head > <meta name="${metadata}" content="${content}">`);
});

/**
 * Extend the Cypress `Chainable` interface so TypeScript recognises
 * the custom `metatag` command and its overloaded signatures.
 */
declare namespace Cypress {
  interface Chainable<Subject> {
    metatag(
      metadata: string,
      content: string,
    ): Chainable<JQuery<HTMLMetaElement>>;
    metatag(metadata: string, content: string): Chainable<Subject>;
  }
}
