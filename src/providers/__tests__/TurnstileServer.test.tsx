import { describe, it, expect, vi, beforeEach, beforeAll } from "vitest";

// Mock next-turnstile
const mockValidate = vi.fn();
vi.mock("next-turnstile", () => ({
	validateTurnstileToken: (...args: unknown[]) => mockValidate(...args),
}));

// Use a dynamic import to get the handler after mocks are set up
let handler: {
	POST: (req: { json: () => Promise<unknown> }) => Promise<{
		status: number;
		json: () => Promise<unknown>;
	}>;
};

describe("TurnstileServer POST handler", () => {
	beforeAll(async () => {
		vi.spyOn(crypto, "randomUUID").mockReturnValue("test-idempotency-key-123");
		const mod = await import("@/providers/TurnstileServer");
		handler = mod as unknown as typeof handler;
	});

	beforeEach(() => {
		mockValidate.mockReset();
		vi.spyOn(crypto, "randomUUID").mockReturnValue("test-idempotency-key-123");
	});

	it("should return 400 when Turnstile validation fails", async () => {
		mockValidate.mockResolvedValue({ success: false });

		const req = {
			json: async () => ({ token: "invalid-token" }),
		};

		const response = await handler.POST(req);
		const body = await response.json();

		expect(response.status).toBe(400);
		expect(body).toEqual({ message: "Invalid token" });
	});

	it("should return success when token is valid", async () => {
		mockValidate.mockResolvedValue({ success: true });

		const req = {
			json: async () => ({ token: "valid-token" }),
		};

		const response = await handler.POST(req);
		const body = await response.json();

		expect(response.status).toBe(200);
		expect(body).toEqual({ message: "Login successful" });
	});

	it("should pass an idempotency key to prevent replay attacks", async () => {
		mockValidate.mockResolvedValue({ success: true });

		const req = {
			json: async () => ({ token: "token-xyz" }),
		};

		await handler.POST(req);

		expect(mockValidate).toHaveBeenCalledTimes(1);
		const callArgs = mockValidate.mock.calls[0][0];
		expect(callArgs.idempotencyKey).toBe("test-idempotency-key-123");
		expect(callArgs.token).toBe("token-xyz");
	});
});
