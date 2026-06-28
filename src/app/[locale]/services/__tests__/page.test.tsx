import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen } from "@/test/test-utils";
import ServicesPage from "../page";

/** Mock React.use() — not available in React 18 test environments. Returns the value as-is. */
vi.mock("react", async () => {
	const actual = await vi.importActual("react");
	return {
		...actual,
		use: <T,>(value: T): T => value,
	};
});

/** Mock next-intl server functions. */
vi.mock("next-intl/server", () => ({
	getTranslations: vi.fn().mockResolvedValue((key: string) => key),
	getMessages: vi.fn().mockResolvedValue({}),
	setRequestLocale: vi.fn(),
}));

/** Mock next-intl client hooks. */
vi.mock("next-intl", async () => {
	const actual = await vi.importActual("next-intl");
	return {
		...actual,
		useTranslations: vi.fn().mockImplementation(() => {
			const t = (key: string) => key;
			t.raw = () => [
				{
					slug: "web-development",
					icon: "/images/dns.svg",
					title: "Web Dev",
					text: "Modern websites.",
				},
			];
			return t;
		}),
		useLocale: vi.fn().mockReturnValue("en"),
	};
});

/** Mock Link from i18n/navigation. */
vi.mock("@/i18n/navigation", () => ({
	Link: ({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) => (
		<a
			href={href}
			className={className}>
			{children}
		</a>
	),
}));

/** Mock ServiceCard to simplify assertions. */
vi.mock("@/ui/Components/Services/ServiceCard", () => ({
	default: ({ title, text }: { title: string; text: string; icon: string }) => (
		<div data-testid="service-card">
			<h3>{title}</h3>
			<p>{text}</p>
		</div>
	),
}));

/** Mock the CTA component. */
vi.mock("@/ui/Components/CtA/Cta", () => ({
	default: () => <div data-testid="cta">CTA</div>,
}));

describe("ServicesPage", () => {
	// Pass the resolved object — the mocked use() returns it as-is
	const defaultParams = { locale: "en" } as unknown as Promise<{ locale: "en" }>;

	it("renders the services heading", async () => {
		renderWithProviders(<ServicesPage params={defaultParams} />);

		expect(await screen.findByText("metadata.title.services")).toBeInTheDocument();
	});

	it("renders the CTA section", async () => {
		renderWithProviders(<ServicesPage params={defaultParams} />);

		expect(await screen.findByTestId("cta")).toBeInTheDocument();
	});
});
