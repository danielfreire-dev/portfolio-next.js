import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import GoogleAnalytics from "@/providers/GoogleAnalytics";

// Mock next/navigation
vi.mock("next/navigation", () => ({
	usePathname: () => "/en/about",
	useSearchParams: () => new URLSearchParams("?ref=test"),
}));

// Mock next/script
vi.mock("next/script", () => ({
	default: ({
		src,
		id,
		strategy,
		dangerouslySetInnerHTML,
		children,
	}: {
		src?: string;
		id?: string;
		strategy?: string;
		dangerouslySetInnerHTML?: { __html: string };
		children?: React.ReactNode;
	}) => (
		<>
			{src && (
				<script
					data-testid={`script-${id ?? "src"}`}
					src={src}
					data-strategy={strategy}
				/>
			)}
			{dangerouslySetInnerHTML && (
				<script
					data-testid={`script-${id ?? "inline"}`}
					data-strategy={strategy}
					dangerouslySetInnerHTML={dangerouslySetInnerHTML}
				/>
			)}
			{children}
		</>
	),
}));

describe("GoogleAnalytics", () => {
	const GA_ID = "G-XXXXXXXXXX";

	describe("script injection", () => {
		it("should inject the GA4 library script with correct measurement ID", () => {
			render(<GoogleAnalytics GA_MEASUREMENT_ID={GA_ID} />);

			const libScript = screen.getByTestId("script-src");
			expect(libScript).toBeInTheDocument();
			expect(libScript).toHaveAttribute("src", `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`);
		});

		it("should inject the GA4 initialization script", () => {
			render(<GoogleAnalytics GA_MEASUREMENT_ID={GA_ID} />);

			const initScript = screen.getByTestId("script-google-analytics");
			expect(initScript).toBeInTheDocument();

			const html = initScript.getAttribute("data-html") ?? (initScript as HTMLElement).innerHTML;

			// The dangerouslySetInnerHTML content should contain the GA ID
			expect(initScript.textContent ?? "").toContain(GA_ID);
		});

		it("should set analytics_storage consent default to denied", () => {
			render(<GoogleAnalytics GA_MEASUREMENT_ID={GA_ID} />);

			const initScript = screen.getByTestId("script-google-analytics");
			const content = initScript.textContent ?? "";
			expect(content).toContain("analytics_storage");
			expect(content).toContain("denied");
		});

		it("should use afterInteractive strategy for both scripts", () => {
			render(<GoogleAnalytics GA_MEASUREMENT_ID={GA_ID} />);

			const libScript = screen.getByTestId("script-src");
			const initScript = screen.getByTestId("script-google-analytics");

			expect(libScript).toHaveAttribute("data-strategy", "afterInteractive");
			expect(initScript).toHaveAttribute("data-strategy", "afterInteractive");
		});
	});

	describe("different measurement IDs", () => {
		it("should use the provided GA ID", () => {
			const customId = "G-CUSTOM123";
			render(<GoogleAnalytics GA_MEASUREMENT_ID={customId} />);

			const libScript = screen.getByTestId("script-src");
			expect(libScript).toHaveAttribute("src", `https://www.googletagmanager.com/gtag/js?id=${customId}`);

			const initScript = screen.getByTestId("script-google-analytics");
			expect(initScript.textContent).toContain(customId);
		});
	});
});
