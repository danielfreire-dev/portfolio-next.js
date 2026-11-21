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
				{
					slug: "ai-solution-implementation",
					icon: "/images/icons/ai-recommend.svg",
					title: "AI Solution Implementation",
					text: "Integrating AI into workflows.",
					longDescription: "AI with purpose.",
					features: [],
				},
			];
			return t;
		}),
		useLocale: vi.fn().mockReturnValue("en"),
	};
});

/** Mock Link and getPathname from i18n/navigation. */
vi.mock("@/i18n/navigation", () => ({
	getPathname: ({ locale, href }: { locale: string; href: string | { pathname: string; params?: Record<string, string> } }) => {
		const path =
			typeof href === "string" ? href : (
				Object.entries(href.params ?? {}).reduce((acc, [key, value]) => acc.replace(`[${key}]`, value), href.pathname)
			);
		return `/${locale}${path === "/" ? "" : path}`;
	},
	Link: ({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) => (
		<a
			href={href}
			className={className}>
			{children}
		</a>
	),
}));

/** Mock TransitionLink to render a plain link in tests. */
vi.mock("@/ui/Components/Sidenav/TransitionLink", () => ({
	TransitionLink: ({
		children,
		href,
		className,
	}: {
		children: React.ReactNode;
		href: string | { pathname: string; params?: Record<string, string> };
		className?: string;
	}) => (
		<a
			href={
				typeof href === "string" ? href : (
					Object.entries(href.params ?? {}).reduce((path, [key, value]) => path.replace(`[${key}]`, value), href.pathname)
				)
			}
			className={className}>
			{children}
		</a>
	),
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

	it("renders the service title as the page's only h1", async () => {
		renderWithProviders(<ServiceDetailPage params={defaultParams} />);

		const headings = await screen.findAllByRole("heading", { level: 1 });
		expect(headings).toHaveLength(1);
		expect(headings[0]).toHaveTextContent("Web Development");
	});

	it("links to the other services but not to itself", async () => {
		renderWithProviders(<ServiceDetailPage params={defaultParams} />);

		const nav = await screen.findByRole("navigation", { name: "serviceDetail.otherServices" });
		const links = nav.querySelectorAll("a");
		expect(links).toHaveLength(1);
		expect(links[0]).toHaveAttribute("href", "/services/ai-solution-implementation");
	});

	it("renders a contextual contact link", async () => {
		renderWithProviders(<ServiceDetailPage params={defaultParams} />);

		const link = await screen.findByText("serviceDetail.ctaLink");
		expect(link.closest("a")).toHaveAttribute("href", "/contact");
	});

	it("emits breadcrumb and service structured data with localized absolute URLs", async () => {
		const { container } = renderWithProviders(<ServiceDetailPage params={defaultParams} />);

		const scripts = [...container.querySelectorAll('script[type="application/ld+json"]')].map((s) =>
			JSON.parse(s.textContent ?? "null"),
		);
		const breadcrumb = scripts.find((s) => s?.["@type"] === "BreadcrumbList");
		const service = scripts.find((s) => s?.["@type"] === "Service");
		expect(breadcrumb.itemListElement.map((i: { item: string }) => i.item)).toEqual([
			"https://daniel-freire.com/en",
			"https://daniel-freire.com/en/services",
			"https://daniel-freire.com/en/services/web-development",
		]);
		expect(service.url).toBe("https://daniel-freire.com/en/services/web-development");
		expect(service.provider["@id"]).toBe("https://daniel-freire.com/#person");
	});

	it("renders the back link to services", async () => {
		renderWithProviders(<ServiceDetailPage params={defaultParams} />);

		const backLink = await screen.findByText("metadata.title.services");
		expect(backLink.closest("a")).toHaveAttribute("href", "/services");
	});
});
