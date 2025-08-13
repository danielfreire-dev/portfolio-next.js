"use server";

import { Resend } from "resend";

// eslint-disable-next-line no-undef
const resend = new Resend(process.env.NEXT_PUBLIC_resend);

export const getData = async (data: Record<string, FormDataEntryValue>) => {
	await resend.emails.send({
		from: "Daniel Freire <onboarding@resend.dev>",

		to: /* `${process.env.NEXT_PUBLIC_emailjs_dataEmail}` */ "danielfreire.web+resend@gmail.com",
		subject: `${data.firstName} ${data.lastName} | Portfólio Daniel Freire`,
		html: `<p>Name: ${data.firstName} ${data.lastName}</p> <p>Phone #: ${data.telephone}</p> <p>Email: ${data.email}</p> <p>Message: ${data.message}</p>`,
	});
};
