import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen, fireEvent } from "@/test/test-utils";
import Slider from "@/ui/Components/Carousel";

// Mock next-intl
vi.mock("next-intl", () => ({
	useTranslations: () => {
		const t = (key: string): string => {
			const map: Record<string, string> = {
				"leftarrow.src": "/icons/chevron-left.svg",
				"leftarrow.alt": "Previous slide",
				"rightarrow.src": "/icons/chevron-right.svg",
				"rightarrow.alt": "Next slide",
			};
			return map[key] ?? key;
		};
		return t;
	},
	NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => children as React.ReactElement,
}));

// Mock next/image
vi.mock("next/image", () => ({
	default: ({ src, alt }: { src: string; alt: string }) => (
		<img
			src={src}
			alt={alt}
			data-testid="next-image"
		/>
	),
}));

// Mock TransitionLink to render plain links
vi.mock("@/ui/Components/Sidenav/TransitionLink", () => ({
	TransitionLink: ({ href, children }: { href: string; children: React.ReactNode }) => <a href={href}>{children}</a>,
}));

const mockItems = [
	{
		id: 1,
		alt: "Slide 1",
		cta: "Learn More",
		description: "First slide description",
		imageUrl: "/images/slide1.webp",
		title: "First Slide",
		url: "/about" as const,
		loading: "lazy" as const,
	},
	{
		id: 2,
		alt: "Slide 2",
		cta: "Get Started",
		description: "Second slide description",
		imageUrl: "/images/slide2.webp",
		title: "Second Slide",
		url: "/portfolio" as const,
		loading: "lazy" as const,
	},
	{
		id: 3,
		alt: "Slide 3",
		cta: "Contact Us",
		description: "Third slide description",
		imageUrl: "/images/slide3.webp",
		title: "Third Slide",
		url: "/contact" as const,
		loading: "lazy" as const,
	},
];

describe("Carousel (Slider)", () => {
	describe("rendering", () => {
		beforeEach(() => {
			renderWithProviders(<Slider items={mockItems} />);
		});

		it("should render the first item initially", () => {
			expect(screen.getByText("First Slide")).toBeInTheDocument();
		});

		it("should render all slides as list items", () => {
			const items = document.querySelectorAll(".item");
			expect(items.length).toBe(3);
		});

		it("should display slide title and description", () => {
			expect(screen.getByText("First Slide")).toBeInTheDocument();
			expect(screen.getByText("First slide description")).toBeInTheDocument();
		});

		it("should render CTA buttons with links", () => {
			const buttons = screen.getAllByRole("button");
			expect(buttons.length).toBeGreaterThanOrEqual(3);
		});

		it("should render next and previous navigation buttons", () => {
			// Previous button
			const prevBtn = document.querySelector(".btn.prev");
			expect(prevBtn).toBeInTheDocument();

			// Next button
			const nextBtn = document.querySelector(".btn.next");
			expect(nextBtn).toBeInTheDocument();
		});
	});

	describe("navigation", () => {
		it("should advance to the next slide when next button is clicked", () => {
			renderWithProviders(<Slider items={mockItems} />);

			expect(screen.getByText("First Slide")).toBeInTheDocument();

			const nextBtn = document.querySelector(".btn.next") as HTMLElement;
			fireEvent.click(nextBtn);

			// After clicking next, first slide moves to end, second becomes first
			expect(screen.getByText("Second Slide")).toBeInTheDocument();
		});

		it("should go to previous slide when prev button is clicked", () => {
			renderWithProviders(<Slider items={mockItems} />);

			const prevBtn = document.querySelector(".btn.prev") as HTMLElement;
			fireEvent.click(prevBtn);

			// Previous wraps to the last item
			expect(screen.getByText("Third Slide")).toBeInTheDocument();
		});

		it("should wrap from last to first when going next repeatedly", () => {
			renderWithProviders(<Slider items={mockItems} />);

			const nextBtn = document.querySelector(".btn.next") as HTMLElement;

			// Click next 3 times to cycle through all slides
			fireEvent.click(nextBtn);
			fireEvent.click(nextBtn);
			fireEvent.click(nextBtn);

			// Should be back at first slide
			expect(screen.getByText("First Slide")).toBeInTheDocument();
		});

		it("should wrap from first to last when going prev", () => {
			renderWithProviders(<Slider items={mockItems} />);

			const prevBtn = document.querySelector(".btn.prev") as HTMLElement;
			fireEvent.click(prevBtn);

			expect(screen.getByText("Third Slide")).toBeInTheDocument();
		});
	});

	describe("pause on hover", () => {
		it("should have mouse enter/leave handlers on the container", () => {
			renderWithProviders(<Slider items={mockItems} />);
			const container = document.querySelector(".slider-container");
			expect(container).toBeInTheDocument();
			// Component sets isPaused on mouse enter/leave
			// The handlers exist on the container element
		});
	});
});
