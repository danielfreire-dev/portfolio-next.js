"use client";

import { submitContact } from "@/lib/submitContact";
import "@/ui/styles/border.css";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import ContactFarewell from "./ContactFarewell";
import { TransitionLink } from "./Sidenav/TransitionLink";
import { Turnstile } from "next-turnstile";
import { useThemeStore } from "@/stores/theme-store";
import { TurnstileSkeleton } from "./Skeletons";

/**
 * Contact form component.
 *
 * Renders a multi-field form with Cloudflare Turnstile bot protection.
 * On successful submission the form sends a notification email via Resend
 * and swaps to a farewell message. Submission state is tracked through an
 * explicit state machine (idle → loading → submitted/error).
 *
 * Turnstile widget loading is handled with a progressive retry strategy:
 * if the Turnstile script hasn't fired onLoad within 3 seconds the widget
 * is force-remounted by bumping a React key; this repeats every 6 seconds
 * until the script loads. If the Turnstile site key environment variable
 * is missing the component renders nothing to avoid a broken widget.
 *
 * @todo Add form input sanitisation before sending data to the server.
 */
const ContactForm = () => {
	type submission = "idle" | "loading" | "loaded" | "error" | "submitted";
	const [loading, setLoading] = useState<submission>("idle");
	const [turnstileStatus, setTurnstileStatus] = useState<"success" | "error" | "expired" | "required">("required");
	const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [turnstileLoaded, setTurnstileLoaded] = useState(false);
	const [turnstileKeyCounter, setTurnstileKeyCounter] = useState(0);

	const t = useTranslations("contact");
	const { isDarkStore } = useThemeStore();
	const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

	useEffect(() => {
		if (turnstileLoaded) return;

		let intervalId: ReturnType<typeof setInterval> | null = null;

		const firstTimeout = setTimeout(() => {
			setTurnstileKeyCounter((prev) => prev + 1);

			intervalId = setInterval(() => {
				setTurnstileKeyCounter((prev) => prev + 1);
			}, 6000);
		}, 3000);

		return () => {
			clearTimeout(firstTimeout);
			if (intervalId !== null) clearInterval(intervalId);
		};
	}, [turnstileLoaded]);

	if (!siteKey) {
		if (typeof window !== "undefined") {
			console.warn("ContactForm: NEXT_PUBLIC_TURNSTILE_SITE_KEY is not set. Turnstile will not render.");
		}
		return null;
	}

	/**
	 * Handles form submission by validating the Turnstile token and
	 * delegating to the `submitContact` server action.
	 *
	 * Guards against submission without a valid Turnstile token (bots
	 * or expired challenges) by checking `turnstileStatus` before
	 * calling the server action. On success the form is hidden and a
	 * farewell message is shown; on failure the error is surfaced
	 * via the `error` state so the user can retry.
	 */
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

		const result = await submitContact(turnstileToken, formValues);

		if (result.success) {
			setLoading("submitted");
		} else {
			console.error("ContactForm submission failed:", result.error);
			setError(result.error);
			setLoading("error");
		}
	}

	return (
		<>
			<form
				onSubmit={sendContactForm}
				className={`mx-5 flex flex-col flex-nowrap items-center ${loading === "submitted" && "hidden"}`}>
				<div className="name-div flex flex-col lg:flex-row">
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
				</div>
				<div className="contacts-div flex flex-col lg:flex-row">
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
				</div>
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
					<div className={turnstileLoaded ? "" : "hidden"}>
						<Turnstile
							key={`turnstile-${isDarkStore ? "dark" : "light"}-${turnstileKeyCounter}`}
							siteKey={siteKey!}
							action="turnstile-spin-v1"
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
					</div>

					{!turnstileLoaded && <TurnstileSkeleton />}

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
