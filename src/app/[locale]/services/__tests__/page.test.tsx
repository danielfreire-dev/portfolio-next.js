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
			t.raw = () => [];
			return t;
		}),
		useLocale: vi.fn().mockReturnValue("en"),
	};
});

/** Mock the shared Services component. */
vi.mock("@/ui/Components/Services", () => ({
	default: () => <div data-testid="services-component">Services Component</div>,
}));

describe("ServicesPage", () => {
	const defaultParams = { locale: "en" } as unknown as Promise<{ locale: "en" }>;

	it("renders the shared Services component", async () => {
		renderWithProviders(<ServicesPage params={defaultParams} />);

		expect(await screen.findByTestId("services-component")).toBeInTheDocument();
	});

	it("calls setRequestLocale with the resolved locale", async () => {
		const { setRequestLocale } = await import("next-intl/server");

		renderWithProviders(<ServicesPage params={defaultParams} />);

		expect(setRequestLocale).toHaveBeenCalledWith("en");
	});
});
