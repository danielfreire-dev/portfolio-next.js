export default async function handler(req, res) {
	const { recaptchaResponse } = req.body;
	const secretKey = process.env.RECAPTCHA_SECRET;

	const response = await fetch(
		`https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaResponse}`,
		{
			method: "POST",
		},
	);
	const data = await response.json();

	if (data.success) {
		res.status(200).json({ success: true });
	} else {
		res.status(400).json({ success: false });
	}
}
