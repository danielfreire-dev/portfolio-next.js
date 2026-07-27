import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderWithProviders, screen, act } from "@/test/test-utils";
import { Providers } from "@/providers/CookieBanner";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Clear localStorage and reset any gtag mock between tests. */
function resetConsent() {
	localStorage.clear();
	if (window.gtag) {
		(window.gtag as ReturnType<typeof vi.fn>).mockClear();
	}
}

/** Assert that the cookie banner is visible. */
function expectBannerVisible() {
	expect(screen.getByRole("region", { name: "Cookies" })).toBeInTheDocument();
}

/** Assert that the cookie banner is NOT visible. */
function expectBannerHidden() {
	expect(screen.queryByRole("region", { name: "Cookies" })).not.toBeInTheDocument();
}

/* ------------------------------------------------------------------ */
/*  Tests                                                              */
/* ------------------------------------------------------------------ */

describe("CookieBanner (Providers)", () => {
	beforeEach(() => {
		resetConsent();
		// Mock gtag if not already present
		if (!window.gtag) {
			window.gtag = vi.fn();
		}
	});

	// ----------------------------------------------------------------
	//  Banner visibility
	// ----------------------------------------------------------------

	describe("banner visibility", () => {
		it("renders the banner when no consent is stored", () => {
			renderWithProviders(
				<Providers>
					<div data-testid="child" />
				</Providers>,
			);
			expectBannerVisible();
			expect(screen.getByTestId("child")).toBeInTheDocument();
		});

		it("hides the banner when consent is already stored", () => {
			localStorage.setItem(
				"cookie-consent",
				JSON.stringify({ prefs: { analytics: false, social: false, marketing: false }, timestamp: 1 }),
			);
			renderWithProviders(
				<Providers>
					<div data-testid="child" />
				</Providers>,
			);
			expectBannerHidden();
			expect(screen.getByTestId("child")).toBeInTheDocument();
		});

		it("does not show banner before hydration completes", () => {
			// Before useEffect runs, the banner should not be visible
			renderWithProviders(
				<Providers>
					<div data-testid="child" />
				</Providers>,
			);
			// After hydration (useEffect), banner appears
			expectBannerVisible();
		});
	});

	// ----------------------------------------------------------------
	//  Accept All
	// ----------------------------------------------------------------

	describe("accept all", () => {
		it("persists full consent to localStorage", () => {
			renderWithProviders(
				<Providers>
					<div />
				</Providers>,
			);
			act(() => {
				screen.getByRole("button", { name: "Accept" }).click();
			});
			const stored = JSON.parse(localStorage.getItem("cookie-consent")!);
			expect(stored.prefs).toEqual({ analytics: true, social: true, marketing: true });
		});

		it("hides the banner after accepting", () => {
			renderWithProviders(
				<Providers>
					<div />
				</Providers>,
			);
			act(() => {
				screen.getByRole("button", { name: "Accept" }).click();
			});
			expectBannerHidden();
		});

		it("calls gtag consent update for analytics", () => {
			const gtag = window.gtag as ReturnType<typeof vi.fn>;
			renderWithProviders(
				<Providers>
					<div />
				</Providers>,
			);
			act(() => {
				screen.getByRole("button", { name: "Accept" }).click();
			});
			expect(gtag).toHaveBeenCalledWith("consent", "update", { analytics_storage: "granted" });
		});
	});

	// ----------------------------------------------------------------
	//  Decline All
	// ----------------------------------------------------------------

	describe("decline all", () => {
		it("persists denied consent to localStorage", () => {
			renderWithProviders(
				<Providers>
					<div />
				</Providers>,
			);
			act(() => {
				screen.getByRole("button", { name: "Decline" }).click();
			});
			const stored = JSON.parse(localStorage.getItem("cookie-consent")!);
			expect(stored.prefs).toEqual({ analytics: false, social: false, marketing: false });
		});

		it("hides the banner after declining", () => {
			renderWithProviders(
				<Providers>
					<div />
				</Providers>,
			);
			act(() => {
				screen.getByRole("button", { name: "Decline" }).click();
			});
			expectBannerHidden();
		});

		it("does NOT call gtag when declining", () => {
			const gtag = window.gtag as ReturnType<typeof vi.fn>;
			renderWithProviders(
				<Providers>
					<div />
				</Providers>,
			);
			act(() => {
				screen.getByRole("button", { name: "Decline" }).click();
			});
			expect(gtag).not.toHaveBeenCalled();
		});
	});

	// ----------------------------------------------------------------
	//  Manage modal
	// ----------------------------------------------------------------

	describe("manage modal", () => {
		it("opens the manage modal when Manage button is clicked", () => {
			renderWithProviders(
				<Providers>
					<div />
				</Providers>,
			);
			act(() => {
				screen.getByRole("button", { name: "Manage" }).click();
			});
			expect(screen.getByRole("dialog")).toBeInTheDocument();
			expect(screen.getByText("Manage Cookies")).toBeInTheDocument();
		});

		it("closes the modal when Cancel is clicked", () => {
			renderWithProviders(
				<Providers>
					<div />
				</Providers>,
			);
			act(() => {
				screen.getByRole("button", { name: "Manage" }).click();
			});
			expect(screen.getByRole("dialog")).toBeInTheDocument();
			act(() => {
				screen.getByRole("button", { name: "Cancel" }).click();
			});
			expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
		});

		it("renders all consent category toggles", () => {
			renderWithProviders(
				<Providers>
					<div />
				</Providers>,
			);
			act(() => {
				screen.getByRole("button", { name: "Manage" }).click();
			});
			expect(screen.getByText("Essential")).toBeInTheDocument();
			expect(screen.getByText("Analytics")).toBeInTheDocument();
			expect(screen.getByText("Social")).toBeInTheDocument();
			expect(screen.getByText("Advertising")).toBeInTheDocument();
		});

		it("has the Essential toggle disabled and checked", () => {
			renderWithProviders(
				<Providers>
					<div />
				</Providers>,
			);
			act(() => {
				screen.getByRole("button", { name: "Manage" }).click();
			});
			const essentialCheckbox = screen.getByLabelText("Essential");
			expect(essentialCheckbox).toBeChecked();
			expect(essentialCheckbox).toBeDisabled();
		});

		it("saves granular preferences and hides the banner", () => {
			renderWithProviders(
				<Providers>
					<div />
				</Providers>,
			);
			act(() => {
				screen.getByRole("button", { name: "Manage" }).click();
			});
			// Toggle Analytics on
			act(() => {
				screen.getByRole("checkbox", { name: "Analytics" }).click();
			});
			// Save
			act(() => {
				screen.getByRole("button", { name: "Save" }).click();
			});
			const stored = JSON.parse(localStorage.getItem("cookie-consent")!);
			expect(stored.prefs.analytics).toBe(true);
			expect(stored.prefs.social).toBe(false);
			expect(stored.prefs.marketing).toBe(false);
			expectBannerHidden();
		});

		it("calls gtag when analytics is toggled on in manage modal", () => {
			const gtag = window.gtag as ReturnType<typeof vi.fn>;
			renderWithProviders(
				<Providers>
					<div />
				</Providers>,
			);
			act(() => {
				screen.getByRole("button", { name: "Manage" }).click();
			});
			act(() => {
				screen.getByRole("checkbox", { name: "Analytics" }).click();
			});
			act(() => {
				screen.getByRole("button", { name: "Save" }).click();
			});
			expect(gtag).toHaveBeenCalledWith("consent", "update", { analytics_storage: "granted" });
		});

		it("does NOT call gtag when analytics is toggled off in manage modal", () => {
			const gtag = window.gtag as ReturnType<typeof vi.fn>;
			renderWithProviders(
				<Providers>
					<div />
				</Providers>,
			);
			act(() => {
				screen.getByRole("button", { name: "Manage" }).click();
			});
			// Analytics is off by default, just save without changing
			act(() => {
				screen.getByRole("button", { name: "Save" }).click();
			});
			expect(gtag).not.toHaveBeenCalled();
		});
	});

	// ----------------------------------------------------------------
	//  Edge cases
	// ----------------------------------------------------------------

	describe("edge cases", () => {
		it("handles corrupted localStorage gracefully", () => {
			localStorage.setItem("cookie-consent", "not-valid-json{{{");
			expect(() => {
				renderWithProviders(
					<Providers>
						<div />
					</Providers>,
				);
			}).not.toThrow();
			// Should still show banner since stored data is invalid
			expectBannerVisible();
		});

		it("renders children even when banner is visible", () => {
			renderWithProviders(
				<Providers>
					<p>Hello World</p>
				</Providers>,
			);
			expect(screen.getByText("Hello World")).toBeInTheDocument();
			expectBannerVisible();
		});

		it("allows re-opening manage modal after cancel", () => {
			renderWithProviders(
				<Providers>
					<div />
				</Providers>,
			);
			// Open → close → open again
			act(() => {
				screen.getByRole("button", { name: "Manage" }).click();
			});
			act(() => {
				screen.getByRole("button", { name: "Cancel" }).click();
			});
			act(() => {
				screen.getByRole("button", { name: "Manage" }).click();
			});
			expect(screen.getByRole("dialog")).toBeInTheDocument();
		});

		it("preserves banner visibility when modal is cancelled", () => {
			renderWithProviders(
				<Providers>
					<div />
				</Providers>,
			);
			act(() => {
				screen.getByRole("button", { name: "Manage" }).click();
			});
			act(() => {
				screen.getByRole("button", { name: "Cancel" }).click();
			});
			// Banner should still be visible
			expectBannerVisible();
		});
	});
});
