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
 * Structured result returned by the submitContact server action.
 * Uses a discriminated union so the client can check `success` and
 * handle errors gracefully instead of receiving an opaque 500.
 */
type SubmitResult = { success: true } | { success: false; error: string };

/**
 * Server action for contact-form submission.
 *
 * Sends two emails via Resend in sequence:
 * 1. A plain-text notification to the site owner with the submitted form
 *    fields and a WEST-timestamped date.
 * 2. A React-rendered welcome email to the user who submitted the form.
 *
 * The Turnstile token is already validated server-side by the `/api/turnstile`
 * route (TurnstileServer.tsx) via the `onVerify` callback in ContactForm.
 * Re-validating the same single-use token here would always fail in
 * production because Turnstile tokens are one-shot.
 *
 * Validation happens in three phases: environment variables first (fail
 * fast with a clear error), then Resend client initialisation, then
 * translation loading. Each phase returns a sanitised error message to
 * the client while logging full details server-side for debugging.
 *
 * @param _token - The Turnstile token from the client widget (pre-validated).
 * @param data   - The submitted form fields as FormData entry values.
 * @returns A discriminated union: `{ success: true }` or
 *          `{ success: false, error: string }`.
 *
 * @todo Consider adding rate limiting (e.g., Upstash Redis) to prevent
 *       abuse of the contact form endpoint.
 */
export const submitContact = async (
	_token: string,
	data: Record<string, FormDataEntryValue>,
): Promise<SubmitResult> => {
	const resendApiKey = process.env.RESEND_API_KEY;
	const dataEmail = process.env.DATA_EMAIL;

	if (!resendApiKey) {
		console.error("[submitContact] Missing RESEND_API_KEY environment variable.");
		return { success: false, error: "Server configuration error. Please try again later." };
	}
	if (!dataEmail) {
		console.error("[submitContact] Missing DATA_EMAIL environment variable.");
		return { success: false, error: "Server configuration error. Please try again later." };
	}

	let resend: Resend;
	try {
		resend = new Resend(resendApiKey);
	} catch (err) {
		console.error("[submitContact] Failed to initialise Resend client:", err);
		return { success: false, error: "Server configuration error. Please try again later." };
	}

	let t: ReturnType<typeof getTranslations> extends Promise<infer T> ? T : never;
	let e: ReturnType<typeof getTranslations> extends Promise<infer T> ? T : never;
	try {
		t = await getTranslations("email");
		e = await getTranslations("email.welcome");
	} catch (err) {
		console.error("[submitContact] Failed to load translations:", err);
		return { success: false, error: "Server error. Please try again later." };
	}

	try {
		await resend.emails.send({
			from: `Daniel Freire <${t("email")}>`,
			to: dataEmail,
			subject: `${data.firstName} ${data.lastName} | Portfólio Daniel Freire`,
			html: `<p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
		<p><strong>Phone #:</strong> ${data.telephone}</p>
		<p><strong>Email:</strong> ${data.email}</p>
		<p><strong>Message:</strong> ${data.message}</p>
		<p><strong>date:</strong> ${getCurrentWESTDateTime()}</p>`,
		});
	} catch (err) {
		console.error("[submitContact] Failed to send notification email:", err);
		return { success: false, error: "Failed to send message. Please try again." };
	}

	try {
		await resend.emails.send({
			from: `Daniel Freire <${t("email")}>`,
			to: `${data.email as string}`,
			subject: `${t("title")} ${data.firstName as string} ${data.lastName as string}`,
			react: WelcomeEmail(e, data.firstName as string, data.lastName as string),
		});
	} catch (err) {
		console.error("[submitContact] Failed to send welcome email:", err);
		return { success: false, error: "Failed to send confirmation. Your message was received." };
	}

	return { success: true };
};
