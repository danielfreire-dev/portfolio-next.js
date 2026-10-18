import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen } from "@/test/test-utils";

// Mock NotFoundPage component
vi.mock("@/ui/Components/NotFoundPage", () => ({
	default: () => <div data-testid="not-found-page">404 - Not Found</div>,
}));

import NotFound from "@/app/[locale]/not-found";

describe("Locale not-found page", () => {
	it("should render the NotFoundPage component without requiring params", () => {
		renderWithProviders(<NotFound />);
		expect(screen.getByTestId("not-found-page")).toBeInTheDocument();
		expect(screen.getByText("404 - Not Found")).toBeInTheDocument();
	});
});
