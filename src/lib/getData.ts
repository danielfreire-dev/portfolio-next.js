"use server";

import { getTranslations } from "next-intl/server";
import { Resend } from "resend";

const resendApiKey = process.env.NEXT_PUBLIC_resend;

if (!resendApiKey) {
	throw new Error("Missing Resend API key");
}

const resend = new Resend(resendApiKey);

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
	const { year, month, day, hour, minute } = Object.fromEntries(
		parts.map((part) => [part.type, part.value]),
	);

	return `${day} de ${month}, ${year} | ${hour}:${minute}`;
}

export const getData = async (data: Record<string, FormDataEntryValue>) => {
	const t = await getTranslations("email");

	await resend.emails.send({
		from: `Daniel Freire <${t("email")}>`,

		to: `${process.env.NEXT_PUBLIC_dataEmail}`,
		subject: `${data.firstName} ${data.lastName} | Portfólio Daniel Freire`,
		html: `<p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
		<p><strong>Phone #:</strong> ${data.telephone}</p>
		<p><strong>Email:</strong> ${data.email}</p>
		<p><strong>Message:</strong> ${data.message}</p>
		<p><strong>date:</strong> ${getCurrentWESTDateTime()}</p>`,
	});
};
