import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen } from "@/test/test-utils";
import { mockMessages } from "@/test/mocks/i18n";

// Mock next-intl/server to avoid real i18n infrastructure during tests
vi.mock("next-intl/server", () => ({
	getMessages: vi.fn().mockResolvedValue(mockMessages),
	setRequestLocale: vi.fn(),
}));

// Mock NotFoundPage component
vi.mock("@/ui/Components/NotFoundPage", () => ({
	default: () => <div data-testid="not-found-page">404 - Not Found</div>,
}));

import GlobalNotFound from "@/app/[locale]/[...rest]/not-found";

describe("Global not-found page", () => {
	it("should render the NotFoundPage component", async () => {
		// The component is async and expects params from Next.js App Router
		const element = await GlobalNotFound({
			params: Promise.resolve({ locale: "en" }),
		});
		renderWithProviders(element);
		expect(screen.getByTestId("not-found-page")).toBeInTheDocument();
		expect(screen.getByText("404 - Not Found")).toBeInTheDocument();
	});
});
