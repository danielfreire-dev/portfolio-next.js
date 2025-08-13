"use client";

import { getData } from "@/lib/getData";
import { sendEmail } from "@/lib/resend";
/* import { sendEmail } from "@/app/api/send"; */
import "@/ui/styles/border.css";
import { useTranslations } from "next-intl";

const ContactForm = () => {
	const t = useTranslations("contact");

	async function sendContactForm(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);
		const formValues = Object.fromEntries(formData);
		await sendEmail(formValues);
		await getData(formValues);
	}
	return (
		<>
			<form onSubmit={sendContactForm} className="mx-auto ">
				<div className="name-div flex">
					<section className="flex flex-col">
						<label htmlFor="firstName" className="capitalize">
							{t("firstName")}
						</label>
						<input
							type="text"
							name="firstName"
							id="firstName"
							className="bg-(--surface) ml-2 my-1"
						/>
					</section>
					<section className="flex flex-col">
						<label htmlFor="lastName" className="capitalize">
							{t("lastName")}
						</label>
						<input
							type="text"
							name="lastName"
							id="lastName"
							className="bg-(--surface) ml-2 my-1"
						/>
					</section>
				</div>
				<div className="contacts-div flex">
					<section className="flex flex-col">
						<label htmlFor="email" className="capitalize">
							{t("email")}
						</label>
						<input
							type="email"
							name="email"
							id="email"
							className="bg-(--surface) ml-2 my-1"
						/>
					</section>
					<section className="flex flex-col">
						<label htmlFor="telephone" className="capitalize">
							{t("phone")}
						</label>
						<input
							type="tel"
							name="telephone"
							id="telephone"
							className="bg-(--surface) ml-2 my-1"
							required
							aria-autocomplete="both"
							aria-required="true"
						/>
					</section>
				</div>
				<section className="message-div flex flex-col">
					<label htmlFor="message" className="capitalize">
						{t("message")}
					</label>
					<textarea
						name="message"
						id="message"
						rows={4}
						cols={40}
						required
						aria-autocomplete="none"
						aria-required="true"
						className="bg-(--surface) ml-2 my-1"
					/>
				</section>
				<section className="flex justify-center mx-auto my-1.5 ">
					<button type="submit" className="bg-(--surface) raise capitalize ">
						{t("btn")}
					</button>
				</section>
			</form>
		</>
	);
};

export default ContactForm;
