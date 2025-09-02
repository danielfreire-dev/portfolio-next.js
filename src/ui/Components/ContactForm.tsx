"use client";

import { getData } from "@/lib/getData";
import { sendEmail } from "@/lib/resend";
/* import { sendEmail } from "@/app/api/send"; */
import "@/ui/styles/border.css";
import { useTranslations } from "next-intl";
import { Suspense, useState } from "react";
import ContactFarewell from "./ContactFarewell";
import { TransitionLink } from "./Sidenav/TransitionLink";
import { Turnstile } from "next-turnstile";
import posthog from "posthog-js";

const ContactForm = () => {
	const [submitted, setSubmitted] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [turnstileStatus, setTurnstileStatus] = useState<
		"success" | "error" | "expired" | "required"
	>("required");
	const [error, setError] = useState<string | null>(null);

	const t = useTranslations("contact");

	const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

	const captureButtonClick = () => {
		posthog.capture("ContactButton_clicked", {
			cool: true,
		});
	};

	async function sendContactForm(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		captureButtonClick();

		setError(null);
		setLoading((prev) => !prev);

		if (turnstileStatus !== "success") {
			setError("Please verify you are not a robot");
			setLoading(false);
			return;
		}

		const formData = new FormData(e.currentTarget);

		const formValues = Object.fromEntries(formData);
		const token = formData.get("cf-turnstile-response");
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

				<section className="flex flex-col justify-center mx-auto mt-2.5">
					<Suspense>
						<Turnstile
							siteKey={siteKey!}
							/* sandbox={siteKey === "development"} */
							retry="auto"
							refreshExpired="auto"
							onError={() => {
								setTurnstileStatus("error");
								setError("Security check failed. Please try again.");
							}}
							onExpire={() => {
								setTurnstileStatus("expired");
								setError("Security check expired. Please verify again.");
							}}
							onLoad={() => {
								setTurnstileStatus("required");
								setError(null);
							}}
							onVerify={(token) => {
								setTurnstileStatus("success");
								setError(null);
							}}
						/>
					</Suspense>
					<button
						type="submit"
						className="bg-(--surface) raise capitalize disabled:opacity-75 disabled:pointer:disabled"
						disabled={loading || turnstileStatus !== "success"}
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
