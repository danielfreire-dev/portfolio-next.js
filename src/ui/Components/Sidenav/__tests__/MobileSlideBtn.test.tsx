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
	describe("when sidenav is open (isOpen=true)", () => {
		it("should render the close icon", () => {
			renderWithProviders(
				<MobileSlideBtn
					isOpen
					setIsOpen={vi.fn()}
				/>,
			);
			expect(screen.getByTestId("icon-close")).toBeInTheDocument();
			expect(screen.queryByTestId("icon-hamburger")).not.toBeInTheDocument();
		});

		it("should have aria-label 'Close menu' on the label element", () => {
			renderWithProviders(
				<MobileSlideBtn
					isOpen
					setIsOpen={vi.fn()}
				/>,
			);
			const labels = screen.getAllByLabelText("Close menu");
			const label = labels.find((el) => el.tagName === "LABEL");
			expect(label).toBeInTheDocument();
		});

		it("should have checkbox checked", () => {
			renderWithProviders(
				<MobileSlideBtn
					isOpen
					setIsOpen={vi.fn()}
				/>,
			);
			const checkbox = screen.getByRole("checkbox");
			expect(checkbox).toBeChecked();
		});

		it("should translate the label by translate-x-56 when open", () => {
			renderWithProviders(
				<MobileSlideBtn
					isOpen
					setIsOpen={vi.fn()}
				/>,
			);
			const labels = screen.getAllByLabelText("Close menu");
			const label = labels.find((el) => el.tagName === "LABEL");
			expect(label?.className).toContain("translate-x-56");
		});
	});

	describe("when sidenav is closed (isOpen=false)", () => {
		it("should render the hamburger icon", () => {
			renderWithProviders(
				<MobileSlideBtn
					isOpen={false}
					setIsOpen={vi.fn()}
				/>,
			);
			expect(screen.getByTestId("icon-hamburger")).toBeInTheDocument();
			expect(screen.queryByTestId("icon-close")).not.toBeInTheDocument();
		});

		it("should have aria-label 'Open menu' on the label element", () => {
			renderWithProviders(
				<MobileSlideBtn
					isOpen={false}
					setIsOpen={vi.fn()}
				/>,
			);
			const labels = screen.getAllByLabelText("Open menu");
			const label = labels.find((el) => el.tagName === "LABEL");
			expect(label).toBeInTheDocument();
		});

		it("should have checkbox unchecked", () => {
			renderWithProviders(
				<MobileSlideBtn
					isOpen={false}
					setIsOpen={vi.fn()}
				/>,
			);
			const checkbox = screen.getByRole("checkbox");
			expect(checkbox).not.toBeChecked();
		});

		it("should translate the label by translate-x-4 when closed", () => {
			renderWithProviders(
				<MobileSlideBtn
					isOpen={false}
					setIsOpen={vi.fn()}
				/>,
			);
			const labels = screen.getAllByLabelText("Open menu");
			const label = labels.find((el) => el.tagName === "LABEL");
			expect(label?.className).toContain("translate-x-4");
		});
	});

	describe("interaction", () => {
		it("should call setIsOpen with toggled value when checkbox changes", () => {
			const setIsOpen = vi.fn();
			renderWithProviders(
				<MobileSlideBtn
					isOpen={false}
					setIsOpen={setIsOpen}
				/>,
			);

			const checkbox = screen.getByRole("checkbox");
			fireEvent.click(checkbox);

			expect(setIsOpen).toHaveBeenCalledTimes(1);
			const updater = setIsOpen.mock.calls[0][0] as (prev: boolean) => boolean;
			expect(updater(false)).toBe(true);
			expect(updater(true)).toBe(false);
		});

		it("should be hidden on large screens (lg:hidden class)", () => {
			renderWithProviders(
				<MobileSlideBtn
					isOpen={false}
					setIsOpen={vi.fn()}
				/>,
			);
			const labels = screen.getAllByLabelText("Open menu");
			const label = labels.find((el) => el.tagName === "LABEL");
			expect(label?.className).toContain("lg:hidden");
		});
	});
});
