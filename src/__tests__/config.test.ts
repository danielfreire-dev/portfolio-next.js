import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

describe("config", () => {
	const originalEnv = { ...process.env };

	beforeEach(() => {
		// Clone process.env before each test so mutations don't leak
		vi.resetModules();
		process.env = { ...originalEnv };
	});

	afterEach(() => {
		process.env = originalEnv;
	});

	describe("port", () => {
		it("should default to 3000 when PORT is not set", async () => {
			delete process.env.PORT;
			const { port } = await import("@/config");
			expect(port).toBe(3000);
		});

		it("should use PORT env value when set", async () => {
			process.env.PORT = "8080";
			const { port } = await import("@/config");
			expect(port).toBe("8080");
		});
	});

	describe("host", () => {
		it("should return localhost URL when VERCEL_PROJECT_PRODUCTION_URL is not set", async () => {
			delete process.env.VERCEL_PROJECT_PRODUCTION_URL;
			process.env.PORT = "3000";
			const { host } = await import("@/config");
			expect(host).toBe("http://localhost:3000");
		});

		it("should use PORT in localhost fallback when set", async () => {
			delete process.env.VERCEL_PROJECT_PRODUCTION_URL;
			process.env.PORT = "4000";
			const { host } = await import("@/config");
			expect(host).toBe("http://localhost:4000");
		});

		it("should return Vercel production URL when env var is set", async () => {
			process.env.VERCEL_PROJECT_PRODUCTION_URL = "my-portfolio.vercel.app";
			const { host } = await import("@/config");
			expect(host).toBe("https://my-portfolio.vercel.app");
		});

		it("should default to port 3000 in localhost when PORT is not set", async () => {
			delete process.env.VERCEL_PROJECT_PRODUCTION_URL;
			delete process.env.PORT;
			const { host } = await import("@/config");
			expect(host).toBe("http://localhost:3000");
		});
	});
});
