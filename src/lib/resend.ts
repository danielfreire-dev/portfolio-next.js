"use server";

import { getTranslations } from "next-intl/server";
import { Resend } from "resend";
import WelcomeEmail from "./EmailTemplate";

const resend = new Resend(process.env.NEXT_PUBLIC_resend);

/**
 * Server action that sends a welcome email via Resend after a contact-form
 * submission.
 *
 * Loads translated email content for the recipient's locale and renders the
 * `WelcomeEmail` React component as the email body.
 */
export const sendEmail = async (data: Record<string, FormDataEntryValue>) => {
  const t = await getTranslations("email");
  const e = await getTranslations("email.welcome");
  await resend.emails.send({
    from: `Daniel Freire <${t("email")}>`,
    to: `${data.email as string}`,
    subject: `${t("title")} ${data.firstName as string} ${data.lastName as string}`,
    react: WelcomeEmail(e, data.firstName as string, data.lastName as string),
  });
};
