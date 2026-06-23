import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, fireEvent } from "@/test/test-utils";
import ThemeToggle from "@/ui/Components/ThemeToggle";

// Mock SVG components
vi.mock("@/ui/Components/svgs/sun", () => ({
	LineMdMoonFilledToSunnyFilledLoopTransition: () => <span data-testid="icon-sun">☀️</span>,
}));

vi.mock("@/ui/Components/svgs/moon", () => ({
	LineMdSunnyFilledLoopToMoonFilledLoopTransition: () => <span data-testid="icon-moon">🌙</span>,
}));

// Mock the Zustand store
const mockSetValue = vi.fn();
let mockIsDarkStore = false;

vi.mock("@/stores/theme-store", () => ({
	useThemeStore: () => ({
		isDarkStore: mockIsDarkStore,
		setValue: mockSetValue,
	}),
}));

describe("ThemeToggle", () => {
	beforeEach(() => {
		mockSetValue.mockClear();
		mockIsDarkStore = false;
	});

	describe("rendering based on theme state", () => {
		it("should show sun icon when in light mode (isDarkStore=false)", () => {
			mockIsDarkStore = false;
			renderWithProviders(<ThemeToggle />);
			expect(screen.getByTestId("icon-sun")).toBeInTheDocument();
			expect(screen.queryByTestId("icon-moon")).not.toBeInTheDocument();
		});

		it("should show moon icon when in dark mode (isDarkStore=true)", () => {
			mockIsDarkStore = true;
			renderWithProviders(<ThemeToggle />);
			expect(screen.getByTestId("icon-moon")).toBeInTheDocument();
			expect(screen.queryByTestId("icon-sun")).not.toBeInTheDocument();
		});

		it("should have checkbox unchecked when in light mode", () => {
			mockIsDarkStore = false;
			renderWithProviders(<ThemeToggle />);
			const checkbox = screen.getByRole("checkbox");
			expect(checkbox).not.toBeChecked();
		});

		it("should have checkbox checked when in dark mode", () => {
			mockIsDarkStore = true;
			renderWithProviders(<ThemeToggle />);
			const checkbox = screen.getByRole("checkbox");
			expect(checkbox).toBeChecked();
		});
	});

	describe("checkbox interaction", () => {
		it("should call setValue with true when checkbox is checked", () => {
			mockIsDarkStore = false;
			renderWithProviders(<ThemeToggle />);
			const checkbox = screen.getByRole("checkbox");
			fireEvent.click(checkbox);
			expect(mockSetValue).toHaveBeenCalledWith(true);
		});

		it("should call setValue with false when checkbox is unchecked", () => {
			mockIsDarkStore = true;
			renderWithProviders(<ThemeToggle />);
			const checkbox = screen.getByRole("checkbox");
			fireEvent.click(checkbox);
			expect(mockSetValue).toHaveBeenCalledWith(false);
		});
	});

	describe("localStorage persistence", () => {
		it("should set 'theme' in localStorage when toggling to dark mode", () => {
			mockIsDarkStore = false;
			renderWithProviders(<ThemeToggle />);
			const checkbox = screen.getByRole("checkbox");
			fireEvent.click(checkbox);

			// localStorage should be set to "dark"
			expect(localStorage.getItem("theme")).toBe("dark");
		});

		it("should set 'theme' in localStorage when toggling to light mode", () => {
			mockIsDarkStore = true;
			renderWithProviders(<ThemeToggle />);
			const checkbox = screen.getByRole("checkbox");
			fireEvent.click(checkbox);

			// localStorage should be set to "light"
			expect(localStorage.getItem("theme")).toBe("light");
		});
	});

	describe("label accessibility", () => {
		it("should have a label linked to the checkbox via htmlFor", () => {
			renderWithProviders(<ThemeToggle />);
			const checkbox = screen.getByRole("checkbox");
			expect(checkbox.id).toBe("theme-toggle");

			// The label should exist and point to the checkbox
			const label = document.querySelector(`label[for="theme-toggle"]`);
			expect(label).toBeInTheDocument();
		});
	});
});
