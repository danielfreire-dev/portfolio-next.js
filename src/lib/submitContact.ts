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
 * Contact locale translations are loaded first so error messages returned
 * to the client match the user's language. The only untranslated fallback
 * is the translation-loading failure itself (a hardcoded English string),
 * since by definition the locale cannot be resolved at that point.
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
	// Load contact translations first so all error paths can use them.
	let c: ReturnType<typeof getTranslations> extends Promise<infer T> ? T : never;
	try {
		c = await getTranslations("contact");
	} catch (err) {
		console.error("[submitContact] Failed to load contact translations:", err);
		return { success: false, error: "Server error. Please try again later." };
	}

	const resendApiKey = process.env.RESEND_API_KEY;
	const dataEmail = process.env.DATA_EMAIL;

	if (!resendApiKey) {
		console.error("[submitContact] Missing RESEND_API_KEY environment variable.");
		return { success: false, error: c("errors.serverConfig") };
	}
	if (!dataEmail) {
		console.error("[submitContact] Missing DATA_EMAIL environment variable.");
		return { success: false, error: c("errors.serverConfig") };
	}

	let resend: Resend;
	try {
		resend = new Resend(resendApiKey);
	} catch (err) {
		console.error("[submitContact] Failed to initialise Resend client:", err);
		return { success: false, error: c("errors.serverConfig") };
	}

	let t: ReturnType<typeof getTranslations> extends Promise<infer T> ? T : never;
	let e: ReturnType<typeof getTranslations> extends Promise<infer T> ? T : never;
	try {
		t = await getTranslations("email");
		e = await getTranslations("email.welcome");
	} catch (err) {
		console.error("[submitContact] Failed to load email translations:", err);
		return { success: false, error: c("errors.serverError") };
	}

	try {
		await resend.emails.send({
			from: `Daniel Freire <${t("email")}>`,
			to: dataEmail,
			subject: `${data.firstName} ${data.lastName} | Portfólio Daniel Freire`,
			html: `<p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
		<p><strong>Phone #:</strong> ${data.telephone}</p>
		<p><strong>Email:</strong> ${data.email}</p>
		<pre><strong>Message:</strong> ${data.message}</pre>
		<p><strong>date:</strong> ${getCurrentWESTDateTime()}</p>`,
		});
	} catch (err) {
		console.error("[submitContact] Failed to send notification email:", err);
		return { success: false, error: c("errors.sendFailed") };
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
		return { success: false, error: c("errors.sendPartial") };
	}

	return { success: true };
};
