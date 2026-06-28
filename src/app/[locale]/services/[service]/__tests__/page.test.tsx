import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen } from "@/test/test-utils";
import ServiceDetailPage from "../page";

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
	getMessages: vi.fn().mockResolvedValue({
		services: [
			{
				slug: "web-development",
				icon: "/images/icons/dns-services.svg",
				iconLarge: "/images/icons/dns-services.svg",
				title: "Web Development",
				text: "Fast, responsive websites.",
				longDescription: "We build modern websites.\n\nThey load fast and work everywhere.",
				features: ["Responsive design", "Core Web Vitals", "PWA support"],
			},
		],
		metadata: {
			title: { services: "Services" },
			description: { services: "Explore services" },
			opengraphImageAlt: "Open Graph image",
		},
		cta: { title: "Get in touch" },
	}),
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
					icon: "/images/icons/dns-services.svg",
					iconLarge: "/images/icons/dns-services.svg",
					title: "Web Development",
					text: "Fast, responsive websites.",
					longDescription: "We build modern websites.\n\nThey load fast and work everywhere.",
					features: ["Responsive design", "Core Web Vitals", "PWA support"],
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

/** Mock Cta component. */
vi.mock("@/ui/Components/CtA/Cta", () => ({
	default: () => <div data-testid="cta">CTA</div>,
}));

/** Mock next/image. */
vi.mock("next/image", () => ({
	default: ({ alt, src, width, height, className }: Record<string, unknown>) => (
		<img
			alt={alt as string}
			src={src as string}
			width={width as number}
			height={height as number}
			className={className as string}
		/>
	),
}));

describe("ServiceDetailPage", () => {
	// Pass the resolved object — the mocked use() returns it as-is
	const defaultParams = {
		locale: "en",
		service: "web-development",
	} as unknown as Promise<{ locale: "en"; service: string }>;

	it("renders the service title", async () => {
		renderWithProviders(<ServiceDetailPage params={defaultParams} />);

		expect(await screen.findByText("Web Development")).toBeInTheDocument();
	});

	it("renders the long description paragraphs", async () => {
		renderWithProviders(<ServiceDetailPage params={defaultParams} />);

		expect(await screen.findByText("We build modern websites.")).toBeInTheDocument();
		expect(await screen.findByText("They load fast and work everywhere.")).toBeInTheDocument();
	});

	it("renders the features list", async () => {
		renderWithProviders(<ServiceDetailPage params={defaultParams} />);

		expect(await screen.findByText("Responsive design")).toBeInTheDocument();
		expect(await screen.findByText("Core Web Vitals")).toBeInTheDocument();
		expect(await screen.findByText("PWA support")).toBeInTheDocument();
	});

	it("renders the back link to services", async () => {
		renderWithProviders(<ServiceDetailPage params={defaultParams} />);

		const backLink = await screen.findByText("metadata.title.services");
		expect(backLink.closest("a")).toHaveAttribute("href", "/services");
	});

	it("renders the CTA section", async () => {
		renderWithProviders(<ServiceDetailPage params={defaultParams} />);

		expect(await screen.findByTestId("cta")).toBeInTheDocument();
	});
});
