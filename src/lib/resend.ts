"use server";

import { getTranslations } from "next-intl/server";
import { Resend } from "resend";
import WelcomeEmail from "./EmailTemplate";

// eslint-disable-next-line no-undef
const resend = new Resend(process.env.NEXT_PUBLIC_resend);

export const sendEmail = async (data: Record<string, FormDataEntryValue>) => {
	const t = await getTranslations("email");
	const e = await getTranslations("email.welcome");
	await resend.emails.send({
		from: `Daniel Freire <${t("email")}>`,
		to: `${data.email}`,
		subject: `${t("title")} ${data.firstName} ${data.lastName}`,
		/* html: `${t("message")} ${data.firstName} ${data.lastName}`, */
		react: WelcomeEmail(e, data.firstName, data.lastName),
	});
};
