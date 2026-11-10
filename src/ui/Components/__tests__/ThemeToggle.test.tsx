import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, fireEvent, act } from "@/test/test-utils";
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

	describe("system theme sync", () => {
		it("should update the <html> dark class when the OS theme changes and no preference is stored", () => {
			localStorage.removeItem("theme");
			let listener: ((e: MediaQueryListEvent) => void) | undefined;
			const originalMatchMedia = window.matchMedia;
			window.matchMedia = ((query: string) => ({
				matches: false,
				media: query,
				onchange: null,
				addListener: () => {},
				removeListener: () => {},
				addEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) => {
					listener = cb;
				},
				removeEventListener: () => {},
				dispatchEvent: () => false,
			})) as unknown as typeof window.matchMedia;

			try {
				renderWithProviders(<ThemeToggle />);
				expect(document.documentElement.classList.contains("dark")).toBe(false);

				act(() => listener!({ matches: true } as MediaQueryListEvent));

				expect(mockSetValue).toHaveBeenLastCalledWith(true);
				expect(document.documentElement.classList.contains("dark")).toBe(true);
			} finally {
				window.matchMedia = originalMatchMedia;
				document.documentElement.classList.remove("dark");
			}
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
