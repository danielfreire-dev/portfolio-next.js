import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen } from "@/test/test-utils";
import NotFoundPage from "@/ui/Components/NotFoundPage";

// Mock next-intl — must include NextIntlClientProvider for renderWithProviders
vi.mock("next-intl", () => ({
	useTranslations: (namespace?: string) => {
		const messages: Record<string, Record<string, string>> = {
			error: {
				"404": "Page Not Found",
				"errorLoading.title": "Oops!",
				description: "The page you're looking for doesn't exist.",
			},
		};
		const t = (key: string): string => (namespace && messages[namespace]?.[key]) ?? key;
		t.rich = (key: string, elements: Record<string, (chunks: React.ReactNode) => React.ReactNode>): React.ReactNode => {
			if (key === "errorLoading.contact") {
				return <span>Please {elements.a?.("contact")} if you need help.</span>;
			}
			return key;
		};
		return t;
	},
	NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => children as React.ReactElement,
}));

describe("NotFoundPage", () => {
	it("should render the 404 heading", () => {
		renderWithProviders(<NotFoundPage />);
		expect(screen.getByText("Page Not Found")).toBeInTheDocument();
	});

	it("should render the error title", () => {
		renderWithProviders(<NotFoundPage />);
		expect(screen.getByText("Oops!")).toBeInTheDocument();
	});

	it("should render the description text", () => {
		renderWithProviders(<NotFoundPage />);
		expect(screen.getByText("The page you're looking for doesn't exist.")).toBeInTheDocument();
	});

	describe("contact link", () => {
		it("should render a mailto link for reporting broken links", () => {
			renderWithProviders(<NotFoundPage />);
			const mailLink = screen.getByRole("link");
			expect(mailLink).toBeInTheDocument();
			expect(mailLink).toHaveAttribute("href", "mailto:webmaster@daniel-freire.com");
		});

		it("should have underline class on the contact link", () => {
			renderWithProviders(<NotFoundPage />);
			const mailLink = screen.getByRole("link");
			expect(mailLink.className).toContain("underline");
		});
	});

	describe("layout", () => {
		it("should use flex column layout centered", () => {
			renderWithProviders(<NotFoundPage />);
			const container = screen.getByText("Page Not Found").closest("div");
			expect(container).toHaveClass("flex");
			expect(container).toHaveClass("flex-col");
			expect(container).toHaveClass("items-center");
		});

		it("should have capitalized headings", () => {
			renderWithProviders(<NotFoundPage />);
			const h2 = screen.getByText("Page Not Found");
			expect(h2).toHaveClass("capitalize");

			const h3 = screen.getByText("Oops!");
			expect(h3).toHaveClass("capitalize");
		});
	});
});
