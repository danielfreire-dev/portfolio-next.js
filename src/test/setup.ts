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

// ---- Restore jsdom Web Storage on Node >= 25 ----
// Node 25+ ships a native `localStorage`/`sessionStorage` global that is
// `undefined` unless `--localstorage-file` is passed. Vitest won't overwrite
// globals Node already defines, so jsdom's working implementation is hidden.
// Re-expose jsdom's storage so tests behave the same on every Node version.
const jsdomWindow = (globalThis as { jsdom?: { window: Window } }).jsdom?.window;
for (const key of ["localStorage", "sessionStorage"] as const) {
	if (jsdomWindow && !globalThis[key]) {
		Object.defineProperty(globalThis, key, {
			configurable: true,
			writable: true,
			value: jsdomWindow[key],
		});
	}
}

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
