import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen } from "@/test/test-utils";

// Mock NotFoundPage component
vi.mock("@/ui/Components/NotFoundPage", () => ({
	default: () => <div data-testid="not-found-page">404 - Not Found</div>,
}));

import GlobalNotFound from "@/app/[locale]/[...rest]/not-found";

describe("Global not-found page", () => {
	it("should render the NotFoundPage component", () => {
		renderWithProviders(<GlobalNotFound />);
		expect(screen.getByTestId("not-found-page")).toBeInTheDocument();
		expect(screen.getByText("404 - Not Found")).toBeInTheDocument();
	});
});
