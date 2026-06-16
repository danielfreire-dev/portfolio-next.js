import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import LegalLinks from "@/ui/Components/Sidenav/LegalLinks";

// Mock next-intl
vi.mock("next-intl", () => ({
	useTranslations: () => {
		const t = (key: string): string => {
			const map: Record<string, string> = {
				"legal.privacyLink": "/privacy-policy",
				"legal.privacyLinkAriaLabel": "View Privacy Policy",
				"legal.privacyLinkTitle": "Privacy Policy",
				"legal.privacyLinkAriaDetails": "Read our privacy policy",
				"legal.privacyName": "Privacy",
			};
			return map[key] ?? key;
		};
		return t;
	},
	NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => children as React.ReactElement,
}));

// Mock TransitionLink
vi.mock("@/ui/Components/Sidenav/TransitionLink", () => ({
	TransitionLink: ({
		href,
		children,
		ariaLabel,
		title,
	}: {
		href: string;
		children: React.ReactNode;
		ariaLabel?: string;
		title?: string;
	}) => (
		<a
			href={href}
			aria-label={ariaLabel}
			title={title}>
			{children}
		</a>
	),
}));

describe("LegalLinks", () => {
	it("should render the privacy policy link", () => {
		renderWithProviders(<LegalLinks />);
		const link = screen.getByRole("link");
		expect(link).toBeInTheDocument();
		expect(link).toHaveTextContent("Privacy");
	});

	it("should link to the privacy policy page", () => {
		renderWithProviders(<LegalLinks />);
		const link = screen.getByRole("link");
		expect(link).toHaveAttribute("href", "/privacy-policy");
	});

	it("should have aria-label for accessibility", () => {
		renderWithProviders(<LegalLinks />);
		const link = screen.getByRole("link");
		expect(link).toHaveAttribute("aria-label", "View Privacy Policy");
	});

	it("should have title attribute for tooltip", () => {
		renderWithProviders(<LegalLinks />);
		const link = screen.getByRole("link");
		expect(link).toHaveAttribute("title", "Privacy Policy");
	});
});
