import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen, fireEvent } from "@/test/test-utils";
import MobileSlideBtn from "@/ui/Components/Sidenav/MobileSlideBtn";

// Mock SVG icon components
vi.mock("@/ui/Components/svgs/LineMdCloseToMenuAltTransition", () => ({
	LineMdCloseToMenuAltTransition: () => <span data-testid="icon-hamburger">☰</span>,
}));

vi.mock("@/ui/Components/svgs/LineMdMenuToCloseAltTransition", () => ({
	LineMdMenuToCloseAltTransition: () => <span data-testid="icon-close">✕</span>,
}));

describe("MobileSlideBtn", () => {
	const renderBtn = (isOpen: boolean, setIsOpen = vi.fn()) =>
		renderWithProviders(
			<MobileSlideBtn
				isOpen={isOpen}
				setIsOpen={setIsOpen}
			/>,
		);

	describe("when sidenav is open (isOpen=true)", () => {
		it("should render the close icon", () => {
			renderBtn(true);
			expect(screen.getByTestId("icon-close")).toBeInTheDocument();
			expect(screen.queryByTestId("icon-hamburger")).not.toBeInTheDocument();
		});

		it("should be a button named 'Menu' with aria-expanded=true", () => {
			renderBtn(true);
			const button = screen.getByRole("button", { name: "Menu" });
			expect(button).toHaveAttribute("aria-expanded", "true");
			expect(button).toHaveAttribute("aria-controls", "sidenav");
		});

		it("should position the button at left-48 when open", () => {
			renderBtn(true);
			expect(screen.getByRole("button").className).toContain("left-48");
		});
	});

	describe("when sidenav is closed (isOpen=false)", () => {
		it("should render the hamburger icon", () => {
			renderBtn(false);
			expect(screen.getByTestId("icon-hamburger")).toBeInTheDocument();
			expect(screen.queryByTestId("icon-close")).not.toBeInTheDocument();
		});

		it("should have aria-expanded=false", () => {
			renderBtn(false);
			expect(screen.getByRole("button", { name: "Menu" })).toHaveAttribute("aria-expanded", "false");
		});

		it("should position the button at left-4 when closed", () => {
			renderBtn(false);
			expect(screen.getByRole("button").className).toContain("left-4");
		});
	});

	describe("interaction", () => {
		it("should call setIsOpen with a toggling updater when clicked", () => {
			const setIsOpen = vi.fn();
			renderBtn(false, setIsOpen);

			fireEvent.click(screen.getByRole("button"));

			expect(setIsOpen).toHaveBeenCalledTimes(1);
			const updater = setIsOpen.mock.calls[0][0] as (prev: boolean) => boolean;
			expect(updater(false)).toBe(true);
			expect(updater(true)).toBe(false);
		});

		it("should be a native button (keyboard operable)", () => {
			renderBtn(false);
			const button = screen.getByRole("button");
			expect(button.tagName).toBe("BUTTON");
			expect(button).toHaveAttribute("type", "button");
		});

		it("should be hidden on large screens (lg:hidden class)", () => {
			renderBtn(false);
			expect(screen.getByRole("button").className).toContain("lg:hidden");
		});
	});
});
