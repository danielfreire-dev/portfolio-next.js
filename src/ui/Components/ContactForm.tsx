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
import { useThemeStore } from "@/stores/theme-store";

/**
 * Contact form component.
 *
 * Renders a multi-field form with Cloudflare Turnstile bot protection.
 * On successful submission, sends a notification email via Resend and
 * displays a farewell message. Tracks submission state through an
 * explicit state machine (idle → loading → submitted/error).
 */
const ContactForm = () => {
	type submission = "idle" | "loading" | "loaded" | "error" | "submitted";
	const [loading, setLoading] = useState<submission>("idle");
	const [turnstileStatus, setTurnstileStatus] = useState<"success" | "error" | "expired" | "required">("required");
	const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [turnstileLoaded, setTurnstileLoaded] = useState(false);

	const t = useTranslations("contact");
	const { isDarkStore, setValue } = useThemeStore();
	const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

	// Guard: if the site key is missing, Turnstile silently fails to render.
	// This catches the case where the env var wasn't set during build or deploy.
	if (!siteKey) {
		if (typeof window !== "undefined") {
			console.warn("ContactForm: NEXT_PUBLIC_TURNSTILE_SITE_KEY is not set. Turnstile will not render.");
		}
		return null;
	}

	/** Handles form submission: validates Turnstile, sends email, stores data. */
	async function sendContactForm(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		setLoading("loading");
		setError(null);

		if (turnstileStatus !== "success" || !turnstileToken) {
			setError("Please verify you are not a robot");
			setLoading("error");
			return;
		}

		const formData = new FormData(e.currentTarget);
		const formValues = Object.fromEntries(formData);

		try {
			await sendEmail(turnstileToken, formValues);
			await getData(turnstileToken, formValues);
			setLoading("submitted");
		} catch (err) {
			console.error("ContactForm submission failed:", err);
			setError("Failed to send message. Please try again.");
			setLoading("error");
		}
	}

	return (
		<>
			{/* TODO: Add form input sanitation */}
			<form
				onSubmit={sendContactForm}
				className={`mx-5 flex flex-col flex-nowrap items-center ${loading === "submitted" && "hidden"}`}>
				<div className="name-div flex flex-col lg:flex-row">
					<Suspense fallback={<p>Loading...</p>}>
						<section className="flex flex-col">
							<label
								htmlFor="firstName"
								className="capitalize">
								{t("firstName")}
								<span className="text-(--error) required" />
							</label>
							<input
								type="text"
								name="firstName"
								id="firstName"
								required
								aria-required="true"
								className="bg-(--surface) ml-2 my-1 autofill:bg-(--secondary)
          peer invalid:border-(--error) valid:border-(--success)"
							/>
						</section>
					</Suspense>
					<Suspense fallback={<p>Loading...</p>}>
						<section className="flex flex-col">
							<label
								htmlFor="lastName"
								className="capitalize">
								{t("lastName")}
							</label>
							<input
								type="text"
								name="lastName"
								id="lastName"
								className="bg-(--surface) ml-2 my-1 autofill:bg-(--secondary)
          peer invalid:border-(--error) valid:border-(--success)"
								aria-required="false"
							/>
						</section>
					</Suspense>
				</div>
				<div className="contacts-div flex flex-col lg:flex-row">
					<Suspense fallback={<p>Loading...</p>}>
						<section className="flex flex-col">
							<label
								htmlFor="email"
								className="capitalize">
								{t("email")}
								<span className="text-(--error) required" />
							</label>
							<input
								type="email"
								name="email"
								id="email"
								required
								aria-required="true"
								className="bg-(--surface) ml-2 my-1 autofill:bg-(--secondary)
          peer invalid:border-(--error) valid:border-(--success)"
							/>
						</section>
					</Suspense>
					<Suspense fallback={<p>Loading...</p>}>
						<section className="flex flex-col">
							<label
								htmlFor="telephone"
								className="capitalize">
								{t("phone")}
							</label>
							<input
								type="tel"
								name="telephone"
								id="telephone"
								className="bg-(--surface) ml-2 my-1 autofill:bg-(--secondary)
          peer invalid:border-(--error) valid:border-(--success)"
								aria-autocomplete="both"
								aria-required="false"
							/>
						</section>
					</Suspense>
				</div>
				<Suspense fallback={<p>Loading...</p>}>
					<section className="message-div flex flex-col">
						<label
							htmlFor="message"
							className="capitalize">
							{t("message")}
							<span className="text-(--error) required" />
						</label>
						<textarea
							name="message"
							id="message"
							rows={4}
							cols={45}
							required
							aria-autocomplete="none"
							aria-required="true"
							className="w-36 lg:w-75 bg-(--surface) justify-center ml-2 my-1 valid:border-(--success) autofill:bg-(--secondary) invalid:border-(--error)"
							spellCheck
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
							className="underline">
							<span className="underline">{t("privacy")}</span>
						</TransitionLink>
						.
					</label>
				</div>

				<section className="flex flex-col justify-center mx-auto mt-2.5">
					<Turnstile
						key={`turnstile-${isDarkStore ? "dark" : "light"}`}
						siteKey={siteKey!}
						retry="auto"
						refreshExpired="auto"
						sandbox={process.env.NODE_ENV === "development"}
						appearance="always"
						theme={isDarkStore ? "dark" : "light"}
						onError={() => {
							setTurnstileStatus("error");
							setError("Security check failed. Please try again.");
							setLoading("error");
						}}
						onExpire={() => {
							setTurnstileStatus("expired");
							setError("Security check expired. Please verify again.");
							setLoading("error");
						}}
						onLoad={() => {
							// Only set "required" on initial load — never overwrite
							// a previously successful verification (e.g. on re-render).
							if (turnstileStatus === "required" || turnstileStatus === "error" || turnstileStatus === "expired") {
								setTurnstileStatus("required");
							}
							setError(null);
							setTurnstileLoaded(true);
						}}
						onVerify={async (token) => {
							try {
								const res = await fetch("/api/turnstile", {
									method: "POST",
									headers: { "Content-Type": "application/json" },
									body: JSON.stringify({ token }),
								});
								if (res.ok) {
									setTurnstileToken(token);
									setTurnstileStatus("success");
									setError(null);
								} else {
									setTurnstileStatus("error");
									setError("Security check failed. Please try again.");
								}
							} catch {
								setTurnstileStatus("error");
								setError("Security check failed. Please try again.");
							}
						}}
					/>

					{error && (
						<p
							role="alert"
							className="text-(--error) text-sm mt-2 text-center">
							{error}
						</p>
					)}

					{turnstileStatus === "required" && turnstileLoaded && !error && (
						<p className="text-(--secondary) text-xs mt-1 text-center">
							Complete the security check above to enable the submit button.
						</p>
					)}

					<button
						type="submit"
						className="bg-(--surface) raise capitalize button-class"
						id="contact-form"
						disabled={loading === "loading" || turnstileStatus !== "success"}>
						{loading === "loading" ? t("sending") || "Sending…" : t("btn")}
					</button>
				</section>
			</form>
			<ContactFarewell submitted={loading === "submitted"} />
		</>
	);
};

export default ContactForm;
