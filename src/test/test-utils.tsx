/**
 * Custom test utilities for the portfolio Next.js app.
 *
 * Provides a `render` wrapper that automatically wraps components in the
 * providers required by the real application (i18n, theme, etc.) so tests
 * can focus on behaviour instead of boilerplate.
 *
 * Usage:
 * ```ts
 * import { render, screen, renderWithProviders } from "@/test/test-utils";
 *
 * test("my component", () => {
 *   renderWithProviders(<MyComponent />);
 *   expect(screen.getByText("Hello")).toBeInTheDocument();
 * });
 * ```
 */

import React, { type ReactNode } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { mockMessages } from "./mocks/i18n";

// Re-export everything from @testing-library/react so consumers only need
// one import from test-utils
export * from "@testing-library/react";
export { render };

// ---- Provider wrapper ----

/** The full provider tree used in the real application. */
function AllTheProviders({
	children,
	locale = "en",
	messages,
}: {
	children: ReactNode;
	locale?: string;
	messages?: Record<string, unknown>;
}) {
	return (
		<NextIntlClientProvider
			locale={locale}
			messages={messages ?? (mockMessages as Record<string, string>)}>
			{children}
		</NextIntlClientProvider>
	);
}

// ---- Custom render ----

/** Options for `renderWithProviders`. */
interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
	/** Override the default mock locale. Defaults to "en". */
	locale?: string;
	/** Override the default mock messages. Defaults to `mockMessages`. */
	messages?: Record<string, unknown>;
}

/**
 * Renders a React element wrapped in all application providers (i18n, etc.).
 *
 * Returns everything that `@testing-library/react`'s `render` returns,
 * plus any pre-configured utilities added in the future.
 */
export function renderWithProviders(ui: React.ReactElement, options?: CustomRenderOptions) {
	const { locale, messages, ...renderOptions } = options ?? {};

	function Wrapper({ children }: { children: ReactNode }) {
		return (
			<AllTheProviders
				locale={locale}
				messages={messages}>
				{children}
			</AllTheProviders>
		);
	}

	return {
		...render(ui, { wrapper: Wrapper, ...renderOptions }),
	};
}

/**
 * Creates a fresh mock `FormData` object for testing form submissions.
 * Each key-value pair represents a form field.
 */
export function createMockFormData(entries: Record<string, string>): FormData {
	const formData = new FormData();
	for (const [key, value] of Object.entries(entries)) {
		formData.append(key, value);
	}
	return formData;
}

/**
 * Helper to await a tick of the React event loop.
 * Useful after state updates that happen in `act()`.
 */
export const tick = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

/**
 * Helper to await a specific number of milliseconds.
 */
export const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
