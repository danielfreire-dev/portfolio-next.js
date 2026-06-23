"use server";

import { getTranslations } from "next-intl/server";
import { Resend } from "resend";
import { validateTurnstileToken } from "next-turnstile";
import WelcomeEmail from "./EmailTemplate";

const resend = new Resend(process.env.NEXT_PUBLIC_resend);

/**
 * Server action that sends a welcome email via Resend after a contact-form
 * submission.
 *
 * Validates the Turnstile token server-side before sending to prevent
 * reliance on client-side checks alone.
 *
 * @param token - The Turnstile token from the client widget.
 * @param data  - The submitted form fields.
 */
export const sendEmail = async (token: string, data: Record<string, FormDataEntryValue>) => {
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
	const e = await getTranslations("email.welcome");
	await resend.emails.send({
		from: `Daniel Freire <${t("email")}>`,
		to: `${data.email as string}`,
		subject: `${t("title")} ${data.firstName as string} ${data.lastName as string}`,
		react: WelcomeEmail(e, data.firstName as string, data.lastName as string),
	});
};
