import { NextRequest, NextResponse } from "next/server";
import { validateTurnstileToken } from "next-turnstile";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
	const { token } = await req.json();

	const validationResponse = await validateTurnstileToken({
		token,
		secretKey: process.env.NEXT_PUBLIC_TURNSTILE_SECRET_KEY!,
		// Optional: Add an idempotency key to prevent token reuse
		idempotencyKey: nanoid(),
		sandbox: process.env.NODE_ENV === "development",
	});

	if (!validationResponse.success) {
		return NextResponse.json({ message: "Invalid token" }, { status: 400 });
	}

	// Handle login

	return NextResponse.json({ message: "Login successful" });
}
