import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen } from "@/test/test-utils";

// Mock next-intl
vi.mock("next-intl", () => ({
	useTranslations: (namespace?: string) => {
		const messages: Record<string, Record<string, string>> = {
			error: {
				"errorLoading.title": "Something went wrong!",
				"errorLoading.description": "We've encountered an error. <retry>Reload</retry>",
			},
		};
		const t = (key: string): string => (namespace && messages[namespace]?.[key]) ?? key;
		t.rich = (key: string, elements: Record<string, (chunks: React.ReactNode) => React.ReactNode>): React.ReactNode => {
			if (key === "errorLoading.description") {
				return <span>We've encountered an error. {elements.retry?.("retry")}</span>;
			}
			return key;
		};
		return t;
	},
	NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => children,
}));

import ErrorBoundary from "@/app/[locale]/error";

describe("Error boundary page", () => {
	it("should render the error title via title attribute", () => {
		const mockError = new Error("Test error");
		const mockReset = vi.fn();

		renderWithProviders(
			<ErrorBoundary
				error={mockError}
				reset={mockReset}
			/>,
		);

		// The h2 has title="Something went wrong!"
		const heading = screen.getByRole("heading", { level: 2 });
		expect(heading).toHaveAttribute("title", "Something went wrong!");
	});

	it("should call reset when retry button is clicked", () => {
		const mockError = new Error("Test error");
		const mockReset = vi.fn();

		renderWithProviders(
			<ErrorBoundary
				error={mockError}
				reset={mockReset}
			/>,
		);

		const retryButton = screen.getByRole("button");
		retryButton.click();

		expect(mockReset).toHaveBeenCalledTimes(1);
	});

	it("should log the error to console", () => {
		const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
		const mockError = new Error("Test error");
		const mockReset = vi.fn();

		renderWithProviders(
			<ErrorBoundary
				error={mockError}
				reset={mockReset}
			/>,
		);

		expect(consoleSpy).toHaveBeenCalledWith(mockError);
		consoleSpy.mockRestore();
	});
});
