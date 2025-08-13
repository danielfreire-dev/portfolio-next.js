"use server";

import { Resend } from "resend";

// eslint-disable-next-line no-undef
const resend = new Resend(process.env.NEXT_PUBLIC_resend);

export const sendEmail = async (data: Record<string, FormDataEntryValue>) => {
	await resend.emails.send({
		from: "Daniel Freire <onboarding@resend.dev>",
		to: `${data.email}`,
		subject: "Hello World",
		html: `<p>Congrats on being the <strong>BEST</strong>!</p> ${data.firstName} ${data.lastName}`,
	});
};
