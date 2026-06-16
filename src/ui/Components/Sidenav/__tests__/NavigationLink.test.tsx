import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import NavigationLink from "@/ui/Components/Sidenav/NavigationLink";

// Mock next/navigation
const mockSegment = vi.fn<() => string | null>(() => null);

vi.mock("next/navigation", () => ({
	useSelectedLayoutSegment: () => mockSegment(),
}));

// Mock @/i18n/navigation
vi.mock("@/i18n/navigation", () => ({
	Link: ({ href, children }: { href: string; children: React.ReactNode }) => <a href={href}>{children}</a>,
}));

// Mock TransitionLink
vi.mock("@/ui/Components/Sidenav/TransitionLink", () => ({
	TransitionLink: ({ href, children }: { href: string; children: React.ReactNode }) => <a href={href}>{children}</a>,
}));

describe("NavigationLink", () => {
	const defaultProps = {
		href: "/about" as const,
		isOpen: false,
		setIsOpen: vi.fn(),
		children: "About Me",
	};

	beforeEach(() => {
		mockSegment.mockReturnValue(null);
	});

	describe("rendering", () => {
		it("should render a link with the correct href", () => {
			renderWithProviders(<NavigationLink {...defaultProps} />);
			const link = screen.getByRole("link");
			expect(link).toHaveAttribute("href", "/about");
		});

		it("should render the children text", () => {
			renderWithProviders(<NavigationLink {...defaultProps} />);
			expect(screen.getByText("About Me")).toBeInTheDocument();
		});
	});

	describe("home route", () => {
		it("should render correctly for the home route", () => {
			renderWithProviders(
				<NavigationLink
					href="/"
					isOpen={false}
					setIsOpen={vi.fn()}>
					Home
				</NavigationLink>,
			);
			expect(screen.getByText("Home")).toBeInTheDocument();
			expect(screen.getByRole("link")).toHaveAttribute("href", "/");
		});
	});
});
