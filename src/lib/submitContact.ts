"use server";

import { getTranslations } from "next-intl/server";
import { Resend } from "resend";
import { validateTurnstileToken } from "next-turnstile";
import WelcomeEmail from "./EmailTemplate";

/**
 * Returns the current date and time formatted for the Europe/Lisbon timezone
 * (WEST/WET), e.g. "15 de Abril, 2026 | 14:30".
 */
function getCurrentWESTDateTime() {
	const now = new Date();
	const formatter = new Intl.DateTimeFormat("pt-PT", {
		timeZone: "Europe/Lisbon",
		year: "numeric",
		month: "long",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	});

	const parts = formatter.formatToParts(now);
	const { year, month, day, hour, minute } = Object.fromEntries(parts.map((part) => [part.type, part.value]));

	return `${day} de ${month}, ${year} | ${hour}:${minute}`;
}

/**
 * Combined server action for contact-form submission.
 *
 * Validates the Turnstile token **once**, then sends two emails via Resend:
 * 1. A notification to the site owner with the submitted form data.
 * 2. A welcome email to the user who submitted the form.
 *
 * This avoids the production-only bug where calling two separate server
 * actions each validated the same single-use Turnstile token.
 *
 * @param token - The Turnstile token from the client widget.
 * @param data  - The submitted form fields.
 */
export const submitContact = async (token: string, data: Record<string, FormDataEntryValue>) => {
	const resendApiKey = process.env.NEXT_PUBLIC_RESEND;
	if (!resendApiKey) {
		throw new Error("Missing Resend API key — set NEXT_PUBLIC_RESEND in .env");
	}

	const secretKey = process.env.TURNSTILE_SECRET_KEY;
	if (!secretKey) {
		throw new Error("Missing Turnstile secret key — set TURNSTILE_SECRET_KEY in .env");
	}

	// Validate the Turnstile token once (single-use — cannot be validated twice).
	const validation = await validateTurnstileToken({
		token,
		secretKey,
		idempotencyKey: crypto.randomUUID(),
		// Only enable sandbox in development; production requires real validation.
		sandbox: process.env.NODE_ENV === "development",
	});

	if (!validation.success) {
		throw new Error("Turnstile token validation failed");
	}

	const resend = new Resend(resendApiKey);
	const t = await getTranslations("email");
	const e = await getTranslations("email.welcome");

	// 1. Notification email to the site owner.
	await resend.emails.send({
		from: `Daniel Freire <${t("email")}>`,
		to: `${process.env.NEXT_PUBLIC_DATA_EMAIL}`,
		subject: `${data.firstName} ${data.lastName} | Portfólio Daniel Freire`,
		html: `<p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
		<p><strong>Phone #:</strong> ${data.telephone}</p>
		<p><strong>Email:</strong> ${data.email}</p>
		<p><strong>Message:</strong> ${data.message}</p>
		<p><strong>date:</strong> ${getCurrentWESTDateTime()}</p>`,
	});

	// 2. Welcome email to the user who submitted the form.
	await resend.emails.send({
		from: `Daniel Freire <${t("email")}>`,
		to: `${data.email as string}`,
		subject: `${t("title")} ${data.firstName as string} ${data.lastName as string}`,
		react: WelcomeEmail(e, data.firstName as string, data.lastName as string),
	});
};
