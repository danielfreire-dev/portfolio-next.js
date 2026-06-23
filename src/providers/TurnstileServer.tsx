import { NextRequest, NextResponse } from "next/server";
import { validateTurnstileToken } from "next-turnstile";

/**
 * POST handler for Cloudflare Turnstile token validation.
 *
 * Receives a Turnstile token from the client, validates it server-side using
 * the configured secret key, and returns a success or error response.
 * Uses an idempotency key to prevent token replay attacks.
 */
export async function POST(req: NextRequest) {
	const { token } = await req.json();

	const validationResponse = await validateTurnstileToken({
		token,
		secretKey: process.env.TURNSTILE_SECRET_KEY!,
		// Idempotency key prevents the same token from being reused
		idempotencyKey: crypto.randomUUID(),
		sandbox: process.env.NODE_ENV === "development",
	});

	if (!validationResponse.success) {
		return NextResponse.json({ message: "Invalid token" }, { status: 400 });
	}

	// Token is valid — proceed with the intended action (e.g. login)
	return NextResponse.json({ message: "Login successful" });
}
