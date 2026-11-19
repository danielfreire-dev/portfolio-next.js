import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen } from "@/test/test-utils";
import Services from "@/ui/Components/Services/Services";

/** Mock next/image — strips the fill prop that jsdom doesn't support. */
vi.mock("next/image", () => ({
	default: ({ src, alt, fill: _fill, ...rest }: Record<string, unknown>) => (
		<img
			src={src as string}
			alt={alt as string}
			{...rest}
			data-testid="next-image"
		/>
	),
}));

/** Mock TransitionLink to render a plain anchor in tests. */
vi.mock("@/ui/Components/Sidenav/TransitionLink", () => ({
	TransitionLink: ({
		children,
		href,
		className,
	}: {
		children: React.ReactNode;
		href: string | { pathname: string; params?: Record<string, string> };
		className?: string;
	}) => (
		<a
			href={
				typeof href === "string" ? href : (
					Object.entries(href.params ?? {}).reduce((path, [key, value]) => path.replace(`[${key}]`, value), href.pathname)
				)
			}
			className={className}
			data-testid="transition-link">
			{children}
		</a>
	),
}));

describe("Services heading level", () => {
	it("renders an h2 by default", () => {
		renderWithProviders(<Services />);
		expect(screen.getByRole("heading", { level: 2, name: "Services" })).toBeInTheDocument();
	});

	it("renders an h1 and intro content when used as the page's main section", () => {
		renderWithProviders(
			<Services headingLevel="h1">
				<p>Intro copy</p>
			</Services>,
		);
		expect(screen.getByRole("heading", { level: 1, name: "Services" })).toBeInTheDocument();
		expect(screen.getByText("Intro copy")).toBeInTheDocument();
	});
});

describe("Services", () => {
	beforeEach(() => {
		renderWithProviders(<Services />);
	});

	describe("heading", () => {
		it("renders the services heading", () => {
			expect(screen.getByText("Services")).toBeInTheDocument();
		});

		it("renders heading with Techstack-matching classes", () => {
			const heading = screen.getByText("Services");
			expect(heading).toHaveClass("text-3xl");
			expect(heading).toHaveClass("font-bold");
			expect(heading).toHaveClass("text-center");
		});
	});

	describe("service cards", () => {
		it("renders all service cards from translation data", () => {
			const cards = screen.getAllByTestId("next-image");
			expect(cards).toHaveLength(2); // mockMessages has 2 services
		});

		it("wraps each card in a TransitionLink", () => {
			const links = screen.getAllByTestId("transition-link");
			expect(links).toHaveLength(2);
		});

		it("links to the correct service detail pages", () => {
			const links = screen.getAllByTestId("transition-link");
			expect(links[0]).toHaveAttribute("href", "/services/web-development");
			expect(links[1]).toHaveAttribute("href", "/services/ai-solution-implementation");
		});

		it("renders each service title", () => {
			expect(screen.getByText("Web Development")).toBeInTheDocument();
			expect(screen.getByText("AI Solution Implementation")).toBeInTheDocument();
		});

		it("renders each service description", () => {
			expect(screen.getByText("Fast, responsive websites.")).toBeInTheDocument();
			expect(screen.getByText("Integrating AI into workflows.")).toBeInTheDocument();
		});
	});

	describe("no CTA", () => {
		it("does not render a CTA section", () => {
			expect(screen.queryByTestId("cta")).not.toBeInTheDocument();
		});
	});
});
