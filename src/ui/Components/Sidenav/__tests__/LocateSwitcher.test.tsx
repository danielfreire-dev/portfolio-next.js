import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import LocaleSwitcher from "@/ui/Components/Sidenav/LocaleSwitcher";

// Mock next-intl
vi.mock("next-intl", () => ({
	useLocale: () => "en",
	useTranslations: () => (key: string) => key,
	NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => children as React.ReactElement,
}));

// Mock i18n/navigation
vi.mock("@/i18n/navigation", () => ({
	usePathname: () => "/en",
	useRouter: () => ({
		push: vi.fn(),
		replace: vi.fn(),
		back: vi.fn(),
		forward: vi.fn(),
		refresh: vi.fn(),
		prefetch: vi.fn(),
	}),
}));

// Mock next/navigation
vi.mock("next/navigation", () => ({
	useParams: () => ({ locale: "en" }),
}));

describe("LocaleSwitcher", () => {
	describe("rendering", () => {
		it("should render the language select button", () => {
			renderWithProviders(<LocaleSwitcher />);
			const button = screen.getByRole("button");
			expect(button).toBeInTheDocument();
		});

		it("should default to English (en)", () => {
			renderWithProviders(<LocaleSwitcher />);
			const button = screen.getByRole("button");
			expect(button).toHaveTextContent("🇬🇧 English");
		});

		it("should have aria-haspopup listbox", () => {
			renderWithProviders(<LocaleSwitcher />);
			const button = screen.getByRole("button");
			expect(button).toHaveAttribute("aria-haspopup", "listbox");
		});
	});
});
