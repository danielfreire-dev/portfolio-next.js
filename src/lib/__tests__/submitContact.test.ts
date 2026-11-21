import { describe, it, expect, vi, beforeEach } from "vitest";

const mockValidate = vi.fn();
vi.mock("next-turnstile", () => ({
	validateTurnstileToken: (...args: unknown[]) => mockValidate(...args),
}));

vi.mock("next-intl/server", () => ({
	getTranslations: vi.fn(async () => (key: string) => key),
}));

const mockSend = vi.fn();
vi.mock("resend", () => ({
	Resend: class {
		emails = { send: mockSend };
	},
}));

vi.mock("../EmailTemplate", () => ({
	default: vi.fn(() => null),
}));

import { submitContact } from "../submitContact";

const validData = {
	firstName: "Jane",
	lastName: "Doe",
	email: "jane@example.com",
	telephone: "",
	message: "Hello there",
};

describe("submitContact", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.stubEnv("RESEND_API_KEY", "re_test");
		vi.stubEnv("DATA_EMAIL", "owner@example.com");
		vi.stubEnv("TURNSTILE_SECRET_KEY", "secret");
		mockValidate.mockResolvedValue({ success: true });
		mockSend.mockResolvedValue({ data: { id: "1" }, error: null });
	});

	it("validates the Turnstile token server-side before sending", async () => {
		const result = await submitContact("tok", validData);

		expect(result).toEqual({ success: true });
		expect(mockValidate).toHaveBeenCalledWith(expect.objectContaining({ token: "tok", secretKey: "secret" }));
		expect(mockSend).toHaveBeenCalledTimes(2);
	});

	it("rejects an invalid Turnstile token without sending email", async () => {
		mockValidate.mockResolvedValue({ success: false });

		const result = await submitContact("bad", validData);

		expect(result).toEqual({ success: false, error: "errors.turnstileFailed" });
		expect(mockSend).not.toHaveBeenCalled();
	});

	it("rejects a missing token without contacting Turnstile", async () => {
		const result = await submitContact("", validData);

		expect(result).toEqual({ success: false, error: "errors.turnstileNotVerified" });
		expect(mockValidate).not.toHaveBeenCalled();
		expect(mockSend).not.toHaveBeenCalled();
	});

	it("returns a config error when the Turnstile secret is missing", async () => {
		vi.stubEnv("TURNSTILE_SECRET_KEY", "");

		const result = await submitContact("tok", validData);

		expect(result).toEqual({ success: false, error: "errors.serverConfig" });
		expect(mockSend).not.toHaveBeenCalled();
	});

	it.each([
		["missing first name", { ...validData, firstName: "  " }],
		["invalid email", { ...validData, email: "not-an-email" }],
		["missing message", { ...validData, message: "" }],
		["non-string field", { ...validData, message: 42 }],
		["oversized message", { ...validData, message: "x".repeat(5001) }],
	])("rejects invalid input: %s", async (_label, data) => {
		const result = await submitContact("tok", data);

		expect(result).toEqual({ success: false, error: "errors.invalidInput" });
		expect(mockSend).not.toHaveBeenCalled();
	});

	it("escapes HTML in the owner notification email", async () => {
		await submitContact("tok", {
			...validData,
			firstName: "<b>Eve</b>",
			message: '<script>alert("x")</script>',
		});

		const html = mockSend.mock.calls[0][0].html as string;
		expect(html).not.toContain("<script>");
		expect(html).not.toContain("<b>Eve</b>");
		expect(html).toContain("&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;");
		expect(html).toContain("&lt;b&gt;Eve&lt;/b&gt;");
	});

	it("sets reply-to on the owner notification to the submitter", async () => {
		await submitContact("tok", validData);

		expect(mockSend.mock.calls[0][0]).toMatchObject({ to: "owner@example.com", replyTo: "jane@example.com" });
		expect(mockSend.mock.calls[1][0]).toMatchObject({ to: "jane@example.com" });
	});
});
