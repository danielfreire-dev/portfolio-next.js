import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen } from "@/test/test-utils";

// Mock next-intl with t.raw support
vi.mock("next-intl", () => ({
	useTranslations: () => {
		const messages: Record<string, unknown> = {
			title: "Privacy Policy",
			header1: "1. Introduction",
			header2: "2. Information We Collect",
			paragraph1: "Welcome to our privacy policy page.",
			paragraph2: "We collect the following information:",
			paragraph2li: ["First name", "Last name", "Email"],
			paragraph3: "We use your data for contact purposes.",
			paragraph4: "Processing based on consent.",
			paragraph5: "No third-party sharing.",
			paragraph6: "Data retained as needed.",
			paragraph7: "You have the right to:",
			paragraph7li: ["Access", "Correction", "Erasure"],
			paragraph8: "We implement security measures.",
			paragraph9: "Contact supervisory authority.",
			paragraph10: "We may update this policy.",
			paragraph11: "Contact us at",
			contactEmail: "gdpr@daniel-freire.com",
			header3: "3. Purpose",
			header4: "4. Legal Basis",
			header5: "5. Sharing",
			header6: "6. Retention",
			header7: "7. Your Rights",
			header8: "8. Security",
			header9: "9. Complaints",
			header10: "10. Updates",
			header11: "11. Contact",
		};
		const t = (key: string): string => (messages[key] as string) ?? key;
		t.raw = (key: string): unknown => messages[key];
		return t;
	},
	NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => children,
}));

import PrivacyPolicyPage from "@/app/[locale]/(legal)/privacy-policy/page";

describe("Privacy Policy page", () => {
	it("should render the page title", () => {
		renderWithProviders(<PrivacyPolicyPage />);
		expect(screen.getByText("Privacy Policy")).toBeInTheDocument();
	});

	it("should render the introduction header", () => {
		renderWithProviders(<PrivacyPolicyPage />);
		expect(screen.getByText("1. Introduction")).toBeInTheDocument();
	});

	it("should render the first paragraph", () => {
		renderWithProviders(<PrivacyPolicyPage />);
		expect(screen.getByText(/Welcome to our privacy policy page/)).toBeInTheDocument();
	});

	it("should render the contact email link", () => {
		renderWithProviders(<PrivacyPolicyPage />);
		const links = screen.getAllByRole("link");
		const mailLinks = links.filter((l) => l.getAttribute("href")?.startsWith("mailto:"));
		expect(mailLinks.length).toBeGreaterThanOrEqual(1);
	});

	it("should render multiple section headers", () => {
		renderWithProviders(<PrivacyPolicyPage />);
		expect(screen.getByText("2. Information We Collect")).toBeInTheDocument();
		expect(screen.getByText("3. Purpose")).toBeInTheDocument();
	});
});
