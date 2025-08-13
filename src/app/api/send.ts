import type { NextApiRequest, NextApiResponse } from "next";

import { Resend } from "resend";

// eslint-disable-next-line no-undef
const resend = new Resend(process.env.NEXT_PUBLIC_resend);

export const sendEmail = async (req: NextApiRequest, res: NextApiResponse) => {
	const { data, error } = await resend.emails.send({
		from: "Daniel Freire <onboarding@resend.dev>",
		to: "data.email",
		subject: "Hello World",
		html: "<p>Congrats on being the <strong>BEST</strong>!</p>",
	});

	if (error) {
		return res.status(400).json(error);
	}

	res.status(200).json(data);
};
