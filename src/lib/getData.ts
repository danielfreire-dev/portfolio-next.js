"use server";

import { getTranslations } from "next-intl/server";
import { Resend } from "resend";
import { validateTurnstileToken } from "next-turnstile";

const resendApiKey = process.env.NEXT_PUBLIC_RESEND;

if (!resendApiKey) {
	throw new Error("Missing Resend API key");
}

const resend = new Resend(resendApiKey);

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
 * Server action that sends contact-form data via the Resend API.
 *
 * Builds an HTML email with the submitted name, phone, email, and message,
 * and dispatches it to the configured recipient address.
 */
export const getData = async (token: string, data: Record<string, FormDataEntryValue>) => {
	const validation = await validateTurnstileToken({
		token,
		secretKey: process.env.TURNSTILE_SECRET_KEY!,
		idempotencyKey: crypto.randomUUID(),
		sandbox: process.env.NODE_ENV === "development",
	});

	if (!validation.success) {
		throw new Error("Turnstile token validation failed");
	}

	const t = await getTranslations("email");

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
};
