import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { TechItem } from "@/ui/Components/Techstack/TechItem";

// Mock next/image
vi.mock("next/image", () => ({
	default: ({ src, alt, unoptimized: _u, ...rest }: Record<string, unknown>) => (
		<img
			src={src as string}
			alt={alt as string}
			{...rest}
			data-testid="tech-image"
		/>
	),
}));

// Mock svgs barrel
vi.mock("@/ui/Components/svgs", () => {
	const mockMap: Record<string, unknown> = {
		TypeScript: (props: Record<string, unknown>) => <svg data-testid="svgr-icon" {...props} />,
	};
	return new Proxy(mockMap, {
		get: (target, prop: string) => (prop in target ? target[prop] : undefined),
	});
});


describe("TechItem", () => {
	const mockTech = {
		id: "typescript",
		link: "https://www.typescriptlang.org",
		logo: "/images/icons/Typescript.svg",
		name: "typeScript",
		svgr: "TypeScript",
		categories: ["Languages"],
	};

	it("should render the technology name and link", () => {
		render(<TechItem tech={mockTech} />);
		expect(screen.getByText("typeScript")).toBeInTheDocument();
		const link = screen.getByRole("link");
		expect(link).toHaveAttribute("href", "https://www.typescriptlang.org");
		expect(link).toHaveAttribute("target", "_blank");
		expect(link).toHaveAttribute("rel", "noopener noreferrer");
	});

	it("should render the SVGR component when matching svgr key exists", () => {
		render(<TechItem tech={mockTech} />);
		const svg = screen.getByRole("img", { name: "typeScript logo" });
		expect(svg).toBeInTheDocument();
		expect(svg).toHaveClass("w-full");
		expect(svg).toHaveClass("h-full");
	});

	it("should fallback to Next.js Image when svgr component is not found", () => {
		const fallbackTech = {
			...mockTech,
			svgr: "NonExistentComponent",
		};
		render(<TechItem tech={fallbackTech} />);
		const img = screen.getByTestId("tech-image");
		expect(img).toBeInTheDocument();
		expect(img).toHaveAttribute("src", "/images/icons/Typescript.svg");
		expect(img).toHaveAttribute("alt", "typeScript logo");
		expect(img).toHaveClass("object-contain");
	});

	it("should have uniform sizing container across both SVGR and Image", () => {
		const { container } = render(<TechItem tech={mockTech} />);
		const imgContainer = container.querySelector(".w-16.h-16");
		expect(imgContainer).toBeInTheDocument();
		expect(imgContainer).toHaveClass("sm:w-20");
		expect(imgContainer).toHaveClass("sm:h-20");
	});
});
