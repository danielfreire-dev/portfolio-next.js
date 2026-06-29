import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderWithProviders, screen, fireEvent, waitFor, act } from "@/test/test-utils";

// Mock lib/server actions before anything imports them
vi.mock("@/lib/submitContact", () => ({
	submitContact: vi.fn().mockResolvedValue({ success: true }),
}));

import ContactForm from "@/ui/Components/ContactForm";
import { submitContact } from "@/lib/submitContact";

// Mock next-intl
vi.mock("next-intl", () => ({
	useTranslations: (namespace?: string) => {
		const messages: Record<string, Record<string, string>> = {
			contact: {
				firstName: "First Name",
				lastName: "Last Name",
				email: "E-mail",
				phone: "Phone",
				message: "Message",
				btn: "Send",
				required: "Required",
				privacyPolicyCheck: "I agree to the",
				privacyPolicyUrl: "/privacy-policy",
				privacy: "Privacy Policy",
				pageTitle: "Contact Page",
				"farewell.title": "Thank You!",
				"farewell.text": "We'll be in touch.",
			},
		};
		const t = (key: string): string => (namespace && messages[namespace]?.[key]) ?? key;
		return t;
	},
	NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => children as React.ReactElement,
}));

// Mock next-turnstile — captures props and auto-fires onLoad asynchronously
// to simulate the real Cloudflare Turnstile widget loading behavior.
// The Turnstile component is always mounted (hidden via CSS until loaded),
// so the mock will always receive and fire onLoad.
// Uses setTimeout (macrotask) rather than queueMicrotask so test assertions
// run before the onLoad callback triggers.
let lastTurnstileProps: Record<string, unknown> = {};
let shouldAutoLoadTurnstile = true;
let turnstileRenderCount = 0;
vi.mock("next-turnstile", () => ({
	Turnstile: (props: Record<string, unknown>) => {
		lastTurnstileProps = props;
		turnstileRenderCount++;
		const { onVerify, onLoad } = props;
		if (shouldAutoLoadTurnstile && typeof onLoad === "function") {
			setTimeout(() => (onLoad as () => void)(), 0);
		}
		return (
			<div data-testid="turnstile-mock">
				<button
					type="button"
					data-testid="turnstile-verify-btn"
					onClick={() => {
						if (typeof onVerify === "function") onVerify("mock-token");
					}}>
					Verify
				</button>
			</div>
		);
	},
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

// Mock TransitionLink
vi.mock("@/ui/Components/Sidenav/TransitionLink", () => ({
	TransitionLink: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
}));

// Mock ContactFarewell
vi.mock("@/ui/Components/ContactFarewell", () => ({
	default: ({ submitted }: { submitted: boolean }) => (
		<div
			data-testid="farewell"
			data-submitted={submitted}>
			{submitted ? "Thank you!" : ""}
		</div>
	),
}));

const MOCK_SITE_KEY = "0x4AAAAAABx80K-mxQMUUheL";

describe("ContactForm", () => {
	beforeEach(() => {
		mockIsDarkStore = false;
		mockSetValue.mockClear();
		lastTurnstileProps = {};
		shouldAutoLoadTurnstile = true;
		turnstileRenderCount = 0;
		vi.clearAllMocks();
		vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", MOCK_SITE_KEY);
		global.fetch = vi.fn().mockResolvedValue({ ok: true });
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	describe("rendering", () => {
		it("should render the Turnstile skeleton while Turnstile has not loaded", () => {
			renderWithProviders(<ContactForm />);
			// Synchronously after render: onLoad is scheduled via setTimeout,
			// so skeleton is in the document and Turnstile mock is wrapped
			// in a div.hidden (display:none) container.
			expect(screen.getByTestId("turnstile-skeleton")).toBeInTheDocument();
			// Turnstile mock is always mounted but hidden via CSS until loaded
			const turnstileMock = screen.getByTestId("turnstile-mock");
			expect(turnstileMock.closest(".hidden")).toBeTruthy();
		});

		it("should replace the skeleton with the Turnstile widget after onLoad fires", async () => {
			renderWithProviders(<ContactForm />);

			// Initially skeleton is in the document, Turnstile is hidden
			expect(screen.getByTestId("turnstile-skeleton")).toBeInTheDocument();
			const turnstileMock = screen.getByTestId("turnstile-mock");
			expect(turnstileMock.closest(".hidden")).toBeTruthy();

			// Wait for the setTimeout onLoad to fire and React to re-render
			await waitFor(() => {
				expect(screen.queryByTestId("turnstile-skeleton")).not.toBeInTheDocument();
			});

			// Now the Turnstile mock should no longer be wrapped in a .hidden container
			expect(turnstileMock.closest(".hidden")).toBeFalsy();
		});

		it("should pass a non-empty siteKey to Turnstile (prevents silent production failure)", async () => {
			renderWithProviders(<ContactForm />);
			// onLoad fires asynchronously via queueMicrotask — wait for it
			await waitFor(() => {
				expect(screen.queryByTestId("turnstile-skeleton")).not.toBeInTheDocument();
			});
			expect(lastTurnstileProps.siteKey).toBe(MOCK_SITE_KEY);
		});

		it("should render the first name field (required)", () => {
			renderWithProviders(<ContactForm />);
			expect(screen.getByLabelText(/First Name/)).toBeInTheDocument();
			expect(screen.getByLabelText(/First Name/)).toBeRequired();
		});

		it("should render the last name field", () => {
			renderWithProviders(<ContactForm />);
			expect(screen.getByLabelText(/Last Name/)).toBeInTheDocument();
		});

		it("should render the email field (required)", () => {
			renderWithProviders(<ContactForm />);
			expect(screen.getByLabelText(/E-mail/)).toBeInTheDocument();
			expect(screen.getByLabelText(/E-mail/)).toBeRequired();
		});

		it("should render the phone field", () => {
			renderWithProviders(<ContactForm />);
			expect(screen.getByLabelText(/Phone/)).toBeInTheDocument();
		});

		it("should render the message textarea (required)", () => {
			renderWithProviders(<ContactForm />);
			expect(screen.getByLabelText(/Message/)).toBeInTheDocument();
			expect(screen.getByLabelText(/Message/)).toBeRequired();
		});

		it("should render the privacy policy checkbox", () => {
			renderWithProviders(<ContactForm />);
			expect(screen.getByLabelText(/I agree to the/)).toBeInTheDocument();
		});

		it("should have the submit button disabled initially", async () => {
			renderWithProviders(<ContactForm />);
			// After onLoad fires, the submit button appears (disabled until Turnstile verified)
			await waitFor(() => {
				expect(screen.queryByTestId("turnstile-skeleton")).not.toBeInTheDocument();
			});
			const button = screen.getByRole("button", { name: "Send" });
			expect(button).toBeDisabled();
		});

		it("should render the required fields note", () => {
			renderWithProviders(<ContactForm />);
			expect(screen.getByText("Required")).toBeInTheDocument();
		});
	});

	describe("Turnstile verification", () => {
		it("should enable the submit button after Turnstile verification", async () => {
			renderWithProviders(<ContactForm />);

			// Wait for Turnstile to load (onLoad microtask)
			await waitFor(() => {
				expect(screen.queryByTestId("turnstile-skeleton")).not.toBeInTheDocument();
			});

			const verifyBtn = screen.getByTestId("turnstile-verify-btn");
			fireEvent.click(verifyBtn);

			// onVerify is async (calls /api/turnstile) — wait for the
			// state update to flush before asserting.
			await waitFor(() => {
				const submitBtn = screen.getByRole("button", { name: "Send" });
				expect(submitBtn).not.toBeDisabled();
			});
		});
	});

	describe("form submission", () => {
		it("should disable the submit button during submission", async () => {
			renderWithProviders(<ContactForm />);

			await waitFor(() => {
				expect(screen.queryByTestId("turnstile-skeleton")).not.toBeInTheDocument();
			});

			fireEvent.click(screen.getByTestId("turnstile-verify-btn"));
			const submitBtn = screen.getByRole("button", { name: "Send" });
			await waitFor(() => {
				expect(submitBtn).not.toBeDisabled();
			});

			fireEvent.change(screen.getByLabelText(/First Name/), {
				target: { value: "John" },
			});
			fireEvent.change(screen.getByLabelText(/E-mail/), {
				target: { value: "john@example.com" },
			});
			fireEvent.change(screen.getByLabelText(/Message/), {
				target: { value: "Hello!" },
			});
			fireEvent.click(screen.getByLabelText(/I agree to the/));

			const form = submitBtn.closest("form")!;
			fireEvent.submit(form);

			await waitFor(() => {
				expect(submitBtn).toBeDisabled();
			});
		});

		it("should show farewell message after successful submission", async () => {
			renderWithProviders(<ContactForm />);

			await waitFor(() => {
				expect(screen.queryByTestId("turnstile-skeleton")).not.toBeInTheDocument();
			});

			fireEvent.click(screen.getByTestId("turnstile-verify-btn"));
			const submitBtn = screen.getByRole("button", { name: "Send" });
			await waitFor(() => {
				expect(submitBtn).not.toBeDisabled();
			});

			fireEvent.change(screen.getByLabelText(/First Name/), {
				target: { value: "John" },
			});
			fireEvent.change(screen.getByLabelText(/E-mail/), {
				target: { value: "john@example.com" },
			});
			fireEvent.change(screen.getByLabelText(/Message/), {
				target: { value: "Hello!" },
			});
			fireEvent.click(screen.getByLabelText(/I agree to the/));

			const form = submitBtn.closest("form")!;
			fireEvent.submit(form);

			await waitFor(() => {
				const farewell = screen.getByTestId("farewell");
				expect(farewell).toHaveAttribute("data-submitted", "true");
			});

			expect(submitContact).toHaveBeenCalledTimes(1);
			expect(submitContact).toHaveBeenCalledWith("mock-token", expect.any(Object));
		});
	});

	describe("form hidden state", () => {
		it("should hide the form when submission is completed", async () => {
			renderWithProviders(<ContactForm />);

			await waitFor(() => {
				expect(screen.queryByTestId("turnstile-skeleton")).not.toBeInTheDocument();
			});

			fireEvent.click(screen.getByTestId("turnstile-verify-btn"));
			const submitBtn = screen.getByRole("button", { name: "Send" });
			await waitFor(() => {
				expect(submitBtn).not.toBeDisabled();
			});

			fireEvent.change(screen.getByLabelText(/First Name/), {
				target: { value: "John" },
			});
			fireEvent.change(screen.getByLabelText(/E-mail/), {
				target: { value: "john@example.com" },
			});
			fireEvent.change(screen.getByLabelText(/Message/), {
				target: { value: "Hello!" },
			});
			fireEvent.click(screen.getByLabelText(/I agree to the/));

			const form = submitBtn.closest("form")!;
			fireEvent.submit(form);

			await waitFor(() => {
				expect(form).toHaveClass("hidden");
			});
		});
	});

	describe("Turnstile load retry", () => {
		it("should retry at 3s then every 6s by rotating the key, and stop after onLoad", () => {
			vi.useFakeTimers();
			shouldAutoLoadTurnstile = false;

			renderWithProviders(<ContactForm />);

			// Initial mount — capture how many times Turnstile has rendered
			const initialRenders = turnstileRenderCount;

			// 3-second first retry — should bump key, causing a remount
			act(() => {
				vi.advanceTimersByTime(3000);
			});
			expect(turnstileRenderCount).toBeGreaterThan(initialRenders);
			const rendersAfter3s = turnstileRenderCount;

			// 6-second second retry — another remount
			act(() => {
				vi.advanceTimersByTime(6000);
			});
			expect(turnstileRenderCount).toBeGreaterThan(rendersAfter3s);

			// Simulate Turnstile finally loading
			act(() => {
				if (typeof lastTurnstileProps.onLoad === "function") {
					(lastTurnstileProps.onLoad as () => void)();
				}
			});

			const rendersAfterLoad = turnstileRenderCount;

			// Advance another 6s — polling should be stopped, no more remounts
			act(() => {
				vi.advanceTimersByTime(6000);
			});
			expect(turnstileRenderCount).toBe(rendersAfterLoad);

			vi.useRealTimers();
		});
	});
});
