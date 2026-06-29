import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, fireEvent, waitFor } from "@/test/test-utils";

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

// Mock next-turnstile — captures props so tests can assert on siteKey, etc.
let lastTurnstileProps: Record<string, unknown> = {};
vi.mock("next-turnstile", () => ({
	Turnstile: (props: Record<string, unknown>) => {
		lastTurnstileProps = props;
		const { onVerify } = props;
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
		vi.clearAllMocks();
		// Ensure the Turnstile site key is available and fetch is mocked
		// for the server-side onVerify API call.
		vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", MOCK_SITE_KEY);
		global.fetch = vi.fn().mockResolvedValue({ ok: true });
	});

	describe("rendering", () => {
		beforeEach(() => {
			renderWithProviders(<ContactForm />);
		});

		it("should pass a non-empty siteKey to Turnstile (prevents silent production failure)", () => {
			expect(lastTurnstileProps.siteKey).toBe(MOCK_SITE_KEY);
		});

		it("should render the first name field (required)", () => {
			expect(screen.getByLabelText(/First Name/)).toBeInTheDocument();
			expect(screen.getByLabelText(/First Name/)).toBeRequired();
		});

		it("should render the last name field", () => {
			expect(screen.getByLabelText(/Last Name/)).toBeInTheDocument();
		});

		it("should render the email field (required)", () => {
			expect(screen.getByLabelText(/E-mail/)).toBeInTheDocument();
			expect(screen.getByLabelText(/E-mail/)).toBeRequired();
		});

		it("should render the phone field", () => {
			expect(screen.getByLabelText(/Phone/)).toBeInTheDocument();
		});

		it("should render the message textarea (required)", () => {
			expect(screen.getByLabelText(/Message/)).toBeInTheDocument();
			expect(screen.getByLabelText(/Message/)).toBeRequired();
		});

		it("should render the privacy policy checkbox", () => {
			expect(screen.getByLabelText(/I agree to the/)).toBeInTheDocument();
		});

		it("should render the Turnstile widget", () => {
			expect(screen.getByTestId("turnstile-mock")).toBeInTheDocument();
		});

		it("should have the submit button disabled initially", () => {
			const button = screen.getByRole("button", { name: "Send" });
			expect(button).toBeDisabled();
		});

		it("should render the required fields note", () => {
			expect(screen.getByText("Required")).toBeInTheDocument();
		});
	});

	describe("Turnstile verification", () => {
		it("should enable the submit button after Turnstile verification", async () => {
			renderWithProviders(<ContactForm />);

			const verifyBtn = screen.getByTestId("turnstile-verify-btn");
			fireEvent.click(verifyBtn);

			// onVerify is now async (calls /api/turnstile) — wait for the
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

			// sendContactForm sets loading="loading" first, which disables the button
			await waitFor(() => {
				expect(submitBtn).toBeDisabled();
			});
		});

		it("should show farewell message after successful submission", async () => {
			renderWithProviders(<ContactForm />);

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

			// Form submission completes → farewell shown
			await waitFor(() => {
				const farewell = screen.getByTestId("farewell");
				expect(farewell).toHaveAttribute("data-submitted", "true");
			});

			// Verify the combined server action was called with token + form data
			expect(submitContact).toHaveBeenCalledTimes(1);
			expect(submitContact).toHaveBeenCalledWith("mock-token", expect.any(Object));
		});
	});

	describe("form hidden state", () => {
		it("should hide the form when submission is completed", async () => {
			renderWithProviders(<ContactForm />);

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
});
