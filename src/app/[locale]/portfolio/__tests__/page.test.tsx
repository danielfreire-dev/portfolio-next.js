import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen } from "@/test/test-utils";
import PortfolioPage from "../page";

/** Mock React.use() — not available in React 18 test environments. Returns the value as-is. */
vi.mock("react", async () => {
	const actual = await vi.importActual("react");
	return {
		...actual,
		use: <T,>(value: T): T => value,
	};
});

/** Mock next-intl server functions. */
vi.mock("next-intl/server", () => ({
	getTranslations: vi.fn().mockResolvedValue((key: string) => key),
	setRequestLocale: vi.fn(),
}));

/** Mock next-intl client hooks. */
vi.mock("next-intl", async () => {
	const actual = await vi.importActual("next-intl");
	return {
		...actual,
		useTranslations: vi.fn().mockImplementation(() => (key: string) => key),
	};
});

/** Mock the website cards grid. */
vi.mock("@/ui/Components/WebsiteCards", () => ({
	default: () => <div data-testid="website-cards" />,
}));

describe("PortfolioPage", () => {
	const params = { locale: "en" } as unknown as Promise<{ locale: "en" }>;

	it("renders the page title and website cards", () => {
		renderWithProviders(<PortfolioPage params={params} />);

		expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("pageTitle!");
		expect(screen.getByTestId("website-cards")).toBeInTheDocument();
	});

	it("emits breadcrumb structured data for the current locale", () => {
		const { container } = renderWithProviders(<PortfolioPage params={params} />);

		const jsonLd = container.querySelector('script[type="application/ld+json"]');
		expect(jsonLd).not.toBeNull();
		expect(jsonLd!.innerHTML).toContain("/en/portfolio");
	});
});
