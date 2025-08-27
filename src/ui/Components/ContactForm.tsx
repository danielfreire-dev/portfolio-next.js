"use client";

import { getData } from "@/lib/getData";
import { sendEmail } from "@/lib/resend";
/* import { sendEmail } from "@/app/api/send"; */
import "@/ui/styles/border.css";
import { useTranslations } from "next-intl";
import { Suspense, useState } from "react";
import ContactFarewell from "./ContactFarewell";
import { TransitionLink } from "./Sidenav/TransitionLink";

const ContactForm = () => {
	const [submitted, setSubmitted] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);

	const t = useTranslations("contact");

	async function sendContactForm(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		setLoading((prev) => !prev);

		const formData = new FormData(e.currentTarget);

		const formValues = Object.fromEntries(formData);

		await sendEmail(formValues);
		await getData(formValues);

		setSubmitted((prev) => !prev);
		setLoading((prev) => !prev);
	}
	return (
		<>
			<form
				onSubmit={sendContactForm}
				className={`mx-5 flex flex-col flex-nowrap items-center ${submitted && "hidden"}`}
			>
				<div className="name-div flex flex-col lg:flex-row">
					<Suspense fallback={<p>Loading...</p>}>
						<section className="flex flex-col">
							<label htmlFor="firstName" className="capitalize">
								{t("firstName")}
								<span className="text-(--error)">*</span>
							</label>
							<input
								type="text"
								name="firstName"
								id="firstName"
								required
								aria-required="true"
								className="bg-(--surface) ml-2 my-1 user-valid:border-(--success) autofill:bg-(--secondary) required:border(--error)"
							/>
						</section>
					</Suspense>
					<Suspense fallback={<p>Loading...</p>}>
						<section className="flex flex-col">
							<label htmlFor="lastName" className="capitalize">
								{t("lastName")}
							</label>
							<input
								type="text"
								name="lastName"
								id="lastName"
								className="bg-(--surface) ml-2 my-1 user-valid:border-(--success) autofill:bg-(--secondary) required:border(--error)"
								aria-required="false"
							/>
						</section>
					</Suspense>
				</div>
				<div className="contacts-div flex flex-col lg:flex-row">
					<Suspense fallback={<p>Loading...</p>}>
						<section className="flex flex-col">
							<label htmlFor="email" className="capitalize">
								{t("email")}
								<span className="text-(--error)">*</span>
							</label>
							<input
								type="email"
								name="email"
								id="email"
								required
								aria-required="true"
								className="bg-(--surface) ml-2 my-1 user-valid:border-(--success) autofill:bg-(--secondary) required:border(--error)"
							/>
						</section>
					</Suspense>
					<Suspense fallback={<p>Loading...</p>}>
						<section className="flex flex-col">
							<label htmlFor="telephone" className="capitalize">
								{t("phone")}
								<span className="text-(--error)">*</span>
							</label>
							<input
								type="tel"
								name="telephone"
								id="telephone"
								className="bg-(--surface) ml-2 my-1 user-valid:border-(--success) autofill:bg-(--secondary) required:border(--error)"
								aria-autocomplete="both"
								aria-required="false"
							/>
						</section>
					</Suspense>
				</div>
				<Suspense fallback={<p>Loading...</p>}>
					<section className="message-div flex flex-col">
						<label htmlFor="message" className="capitalize">
							{t("message")}
							<span className="text-(--error)">*</span>
						</label>
						<textarea
							name="message"
							id="message"
							rows={4}
							cols={45}
							required
							aria-autocomplete="none"
							aria-required="true"
							className="w-36 lg:w-75 bg-(--surface) justify-center ml-2 my-1 user-valid:border-(--success) autofill:bg-(--secondary) required:border(--error)"
						/>
					</section>
				</Suspense>
				<div className="privacy-policy-req mt-1.5">
					<p className="align-start">
						<span className="text-(--error)">*</span>
						<span className="capitalize">{t("required")}</span>
					</p>
					<label htmlFor="privacy-policy-check">
						<input
							type="checkbox"
							name="privacy-policy-check"
							id="privacy-policy-check"
							className=" accent-(--primary) focus:shadow-(--primary)"
							required
						/>{" "}
						{t("privacyPolicyCheck")}{" "}
						<TransitionLink
							href={t("privacyPolicyUrl") as "/privacy-policy"}
							target="_blank"
						>
							{t("privacy")}
						</TransitionLink>
						.
					</label>
				</div>

				<section className="flex justify-center mx-auto mt-2.5">
					<button
						type="submit"
						className="bg-(--surface) raise capitalize disabled:opacity-75 disabled:pointer:disabled"
						disabled={loading}
					>
						{t("btn")}
					</button>
				</section>
			</form>
			<ContactFarewell submitted={submitted} />
		</>
	);
};

export default ContactForm;
