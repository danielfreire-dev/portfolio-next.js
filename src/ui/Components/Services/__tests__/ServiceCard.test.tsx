import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ServiceCard from "@/ui/Components/Services/ServiceCard";

// Mock next/image — strips the fill prop that jsdom doesn't support
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

describe("ServiceCard", () => {
	const defaultProps = {
		title: "Web Development",
		text: "Full-stack web development services",
		icon: "/icons/web-dev.svg",
	};

	describe("rendering", () => {
		beforeEach(() => {
			render(<ServiceCard {...defaultProps} />);
		});

		it("should render the service title", () => {
			expect(screen.getByText("Web Development")).toBeInTheDocument();
		});

		it("should render the service description text", () => {
			expect(screen.getByText("Full-stack web development services")).toBeInTheDocument();
		});

		it("should render the service icon image", () => {
			const img = screen.getByTestId("next-image");
			expect(img).toBeInTheDocument();
			expect(img).toHaveAttribute("src", "/icons/web-dev.svg");
			expect(img).toHaveAttribute("alt", "Web Development");
		});
	});

	describe("with different props", () => {
		it("should render different title and text", () => {
			render(
				<ServiceCard
					title="UI/UX Design"
					text="Beautiful interfaces"
					icon="/icons/design.svg"
				/>,
			);

			expect(screen.getByText("UI/UX Design")).toBeInTheDocument();
			expect(screen.getByText("Beautiful interfaces")).toBeInTheDocument();
			const img = screen.getByTestId("next-image");
			expect(img).toHaveAttribute("alt", "UI/UX Design");
		});
	});

	describe("CSS classes", () => {
		it("should have the surface-cards class", () => {
			const { container } = render(<ServiceCard {...defaultProps} />);
			const card = container.querySelector(".surface-cards");
			expect(card).toBeInTheDocument();
		});

		it("should render title with capitalize class", () => {
			render(<ServiceCard {...defaultProps} />);
			const title = screen.getByText("Web Development");
			expect(title).toHaveClass("capitalize");
		});
	});

	describe("overflow handling", () => {
		it("should add break-words and hyphens-auto to the title for long-word wrapping", () => {
			render(<ServiceCard {...defaultProps} />);
			const title = screen.getByText("Web Development");
			expect(title).toHaveClass("break-words");
			expect(title).toHaveClass("hyphens-auto");
		});

		it("should add break-words and hyphens-auto to the description for long-word wrapping", () => {
			render(<ServiceCard {...defaultProps} />);
			const text = screen.getByText("Full-stack web development services");
			expect(text).toHaveClass("break-words");
			expect(text).toHaveClass("hyphens-auto");
		});

		it("should have overflow-hidden on the text container to clip overflow", () => {
			const { container } = render(<ServiceCard {...defaultProps} />);
			const textContainer = container.querySelector(".min-w-0");
			expect(textContainer).toHaveClass("overflow-hidden");
		});

		it("should have overflow-hidden (not overflow-visible) on the image wrapper", () => {
			const { container } = render(<ServiceCard {...defaultProps} />);
			const imageWrapper = container.querySelector(".shrink-0");
			expect(imageWrapper).toHaveClass("overflow-hidden");
			expect(imageWrapper).not.toHaveClass("overflow-visible");
		});

		it("should render a long unbroken title without crashing (German compound word)", () => {
			render(
				<ServiceCard
					title="MaßgeschneiderteUnternehmenssoftwareOhneLeerzeichen"
					text="Test description"
					icon="/icons/test.svg"
				/>,
			);
			expect(screen.getByText("MaßgeschneiderteUnternehmenssoftwareOhneLeerzeichen")).toBeInTheDocument();
		});

		it("should render a long description text without crashing", () => {
			const longText =
				"Aplicações web à medida — CRMs, dashboards e ferramentas internas que se adaptam à forma como o seu negócio realmente funciona.";
			render(
				<ServiceCard
					title="Long Description Test"
					text={longText}
					icon="/icons/test.svg"
				/>,
			);
			expect(screen.getByText(longText)).toBeInTheDocument();
		});
	});
});
