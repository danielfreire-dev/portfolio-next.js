"use server";

import { getTranslations } from "next-intl/server";
import { validateTurnstileToken } from "next-turnstile";
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

/** Escapes characters with special meaning in HTML so user input renders as text. */
function escapeHtml(value: string): string {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
}

/** Validated, normalised contact form fields. */
type ContactFields = {
	firstName: string;
	lastName: string;
	email: string;
	telephone: string;
	message: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates untrusted form input on the server.
 *
 * Server actions are public POST endpoints, so the client-side `required`
 * attributes cannot be relied on. Returns `null` when any field is missing,
 * of the wrong type, or exceeds its length limit.
 */
function parseContactFields(data: Record<string, unknown>): ContactFields | null {
	const str = (key: string, max: number, required: boolean): string | null => {
		const raw = data[key];
		if (raw === undefined || raw === null) return required ? null : "";
		if (typeof raw !== "string") return null;
		// Collapse line breaks in single-line fields (used in the subject).
		const value = (key === "message" ? raw : raw.replace(/[\r\n]+/g, " ")).trim();
		if (required && value.length === 0) return null;
		if (value.length > max) return null;
		return value;
	};

	const firstName = str("firstName", 100, true);
	const lastName = str("lastName", 100, false);
	const email = str("email", 254, true);
	const telephone = str("telephone", 40, false);
	const message = str("message", 5000, true);

	if (firstName === null || lastName === null || email === null || telephone === null || message === null) {
		return null;
	}
	if (!EMAIL_RE.test(email)) return null;

	return { firstName, lastName, email, telephone, message };
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
 * 1. Validates the Cloudflare Turnstile token server-side. This must happen
 *    here (not in a separate endpoint) because server actions are publicly
 *    callable — otherwise the captcha could be bypassed by invoking the
 *    action directly.
 * 2. Validates and normalises the submitted fields.
 * 3. Sends two emails via Resend in sequence:
 *    - an HTML notification to the site owner (all user input escaped);
 *    - a React-rendered welcome email to the submitter.
 *
 * Contact locale translations are loaded first so error messages returned
 * to the client match the user's language. The only untranslated fallback
 * is the translation-loading failure itself (a hardcoded English string),
 * since by definition the locale cannot be resolved at that point.
 *
 * @param token - The single-use Turnstile token from the client widget.
 * @param data  - The submitted form fields (untrusted).
 * @returns A discriminated union: `{ success: true }` or
 *          `{ success: false, error: string }`.
 *
 * @todo Consider adding rate limiting (e.g., Upstash Redis) to prevent
 *       abuse of the contact form endpoint.
 */
export const submitContact = async (token: string, data: Record<string, unknown>): Promise<SubmitResult> => {
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
	const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;

	if (!resendApiKey || !dataEmail || !turnstileSecret) {
		console.error(
			"[submitContact] Missing environment variable(s):",
			[!resendApiKey && "RESEND_API_KEY", !dataEmail && "DATA_EMAIL", !turnstileSecret && "TURNSTILE_SECRET_KEY"]
				.filter(Boolean)
				.join(", "),
		);
		return { success: false, error: c("errors.serverConfig") };
	}

	if (typeof token !== "string" || token.length === 0) {
		return { success: false, error: c("errors.turnstileNotVerified") };
	}

	try {
		const verification = await validateTurnstileToken({
			token,
			secretKey: turnstileSecret,
			sandbox: process.env.NODE_ENV === "development",
		});
		if (!verification.success) {
			return { success: false, error: c("errors.turnstileFailed") };
		}
	} catch (err) {
		console.error("[submitContact] Turnstile validation request failed:", err);
		return { success: false, error: c("errors.turnstileFailed") };
	}

	const fields = parseContactFields(data ?? {});
	if (!fields) {
		return { success: false, error: c("errors.invalidInput") };
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

	const { firstName, lastName, email, telephone, message } = fields;
	const fullName = `${firstName} ${lastName}`.trim();

	try {
		await resend.emails.send({
			from: `Daniel Freire <${t("email")}>`,
			to: dataEmail,
			replyTo: email,
			subject: `${fullName} | Portfólio Daniel Freire`,
			html: `<p><strong>Name:</strong> ${escapeHtml(fullName)}</p>
		<p><strong>Phone #:</strong> ${escapeHtml(telephone)}</p>
		<p><strong>Email:</strong> ${escapeHtml(email)}</p>
		<pre><strong>Message:</strong> ${escapeHtml(message)}</pre>
		<p><strong>date:</strong> ${getCurrentWESTDateTime()}</p>`,
		});
	} catch (err) {
		console.error("[submitContact] Failed to send notification email:", err);
		return { success: false, error: c("errors.sendFailed") };
	}

	try {
		await resend.emails.send({
			from: `Daniel Freire <${t("email")}>`,
			to: email,
			subject: `${t("title")} ${fullName}`,
			react: WelcomeEmail(e, firstName, lastName),
		});
	} catch (err) {
		console.error("[submitContact] Failed to send welcome email:", err);
		return { success: false, error: c("errors.sendPartial") };
	}

	return { success: true };
};
