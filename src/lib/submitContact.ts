"use server";

import { getTranslations } from "next-intl/server";
import { Resend } from "resend";
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
 * Server action for contact-form submission.
 *
 * Sends two emails via Resend:
 * 1. A notification to the site owner with the submitted form data.
 * 2. A welcome email to the user who submitted the form.
 *
 * The Turnstile token is already validated server-side by the /api/turnstile
 * route (TurnstileServer.tsx) via the onVerify callback in ContactForm.
 * Double-validating the same single-use token would always fail in production.
 *
 * @param _token - The Turnstile token from the client widget (pre-validated).
 * @param data   - The submitted form fields.
 */
export const submitContact = async (_token: string, data: Record<string, FormDataEntryValue>) => {
	const resendApiKey = process.env.NEXT_PUBLIC_RESEND;
	if (!resendApiKey) {
		throw new Error("Missing Resend API key — set NEXT_PUBLIC_RESEND in .env");
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
