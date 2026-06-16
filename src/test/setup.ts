import "@testing-library/jest-dom/vitest";

/**
 * Test setup file — Vitest configuration and global test setup.
 *
 * Imports `@testing-library/jest-dom/vitest` to extend Vitest's `expect` with
 * DOM-specific matchers such as `toBeInTheDocument`, `toHaveAttribute`,
 * `toHaveClass`, `toBeVisible`, etc.
 *
 * Add global mocks or polyfills below as needed.
 */

// ---- Polyfill window.matchMedia (not implemented in jsdom) ----

Object.defineProperty(window, "matchMedia", {
	writable: true,
	value: (query: string) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: () => {},
		removeListener: () => {},
		addEventListener: () => {},
		removeEventListener: () => {},
		dispatchEvent: () => false,
	}),
});

// ---- Suppress specific console warnings during tests ----

const originalWarn = console.warn;
console.warn = (...args: unknown[]) => {
	const msg = typeof args[0] === "string" ? args[0] : "";
	if (msg.includes("React.createFactory") || msg.includes("Warning: validateDOMNesting")) {
		return;
	}
	originalWarn.call(console, ...args);
};
