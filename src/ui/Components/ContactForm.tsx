"use client";

import { submitContact } from "@/lib/submitContact";
import "@/ui/styles/border.css";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import ContactFarewell from "./ContactFarewell";
import { Link } from "@/i18n/navigation";
import { Turnstile } from "next-turnstile";
import { useThemeStore } from "@/stores/theme-store";
import { TurnstileSkeleton } from "./Skeletons";

/** Required fields validated before submit, in DOM order (the first error gets focus). */
const VALIDATED_FIELDS = ["firstName", "email", "message", "privacy-policy-check"] as const;
type ValidatedField = (typeof VALIDATED_FIELDS)[number];
type FieldErrorKey = "firstName" | "email" | "emailInvalid" | "message" | "privacy";

/** Type guard: is this form control one of {@link VALIDATED_FIELDS}? */
function isValidatedControl(el: unknown): el is HTMLInputElement | HTMLTextAreaElement {
	return (
		(el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) &&
		(VALIDATED_FIELDS as readonly string[]).includes(el.name)
	);
}

/** Maps a control's constraint-validation state to a `contact.errors.fields.*` key (null when valid). */
function fieldErrorKey(el: HTMLInputElement | HTMLTextAreaElement): FieldErrorKey | null {
	if (el.validity.valid) return null;
	switch (el.name as ValidatedField) {
		case "firstName":
			return "firstName";
		case "email":
			return el.validity.valueMissing ? "email" : "emailInvalid";
		case "message":
			return "message";
		case "privacy-policy-check":
			return "privacy";
	}
}

/**
 * Contact form component.
 *
 * Renders a multi-field form with Cloudflare Turnstile bot protection.
 * On successful submission the form sends a notification email via Resend
 * and swaps to a farewell message. Submission state is tracked through an
 * explicit state machine (idle → loading → submitted/error).
 *
 * Field errors (WCAG 3.3.1 / 3.3.3): the form uses `noValidate` and shows its
 * own translated message under each invalid field, tied to it with
 * `aria-describedby` + `aria-invalid`. A field is checked when it loses focus
 * after being edited, re-checked as the user types once it shows an error, and
 * all fields are checked on submit, which moves focus to the first invalid one.
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
	const [fieldErrors, setFieldErrors] = useState<Partial<Record<ValidatedField, string>>>({});
	/** Fields the user has edited; untouched fields aren't flagged on blur. */
	const editedFields = useRef(new Set<string>());

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
	 * Handles form submission by delegating to the `submitContact` server
	 * action, which validates the Turnstile token server-side.
	 *
	 * Skips the round-trip when the widget hasn't produced a token yet.
	 * On success the form is hidden and a farewell message is shown; on
	 * failure the error is surfaced via the `error` state and the widget
	 * is reset so the user can retry with a fresh token.
	 */
	/** Validates one control, updates its message, and returns whether it is valid. */
	function validateField(el: HTMLInputElement | HTMLTextAreaElement): boolean {
		const key = fieldErrorKey(el);
		setFieldErrors((prev) => ({ ...prev, [el.name]: key ? t(`errors.fields.${key}`) : undefined }));
		return key === null;
	}

	/** `aria-invalid` / `aria-describedby` for a validated control. */
	const errorProps = (field: ValidatedField) =>
		fieldErrors[field] ? { "aria-invalid": true, "aria-describedby": `${field}-error` } : {};

	/** The message element referenced by {@link errorProps}. */
	const renderFieldError = (field: ValidatedField) =>
		fieldErrors[field] ?
			<p
				id={`${field}-error`}
				// Text fields: w-0 + min-w so a long message wraps to the field's width
				// instead of widening the w-fit wrapper (same trick as the textarea).
				className={`text-sm text-(--error) ${
					field === "privacy-policy-check" ? "mt-1" : "w-0 min-w-[calc(100%-0.5rem)] ml-2 mb-1"
				}`}>
				{fieldErrors[field]}
			</p>
		:	null;

	async function sendContactForm(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		const invalid = VALIDATED_FIELDS.map((name) => e.currentTarget.elements.namedItem(name))
			.filter(isValidatedControl)
			.filter((el) => !validateField(el));
		if (invalid.length > 0) {
			invalid[0].focus();
			return;
		}

		setLoading("loading");
		setError(null);

		if (turnstileStatus !== "success" || !turnstileToken) {
			setError(t("errors.turnstileNotVerified"));
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
			// Turnstile tokens are single-use and the server has consumed this
			// one, so remount the widget to obtain a fresh token for a retry.
			setTurnstileToken(null);
			setTurnstileStatus("required");
			setTurnstileKeyCounter((prev) => prev + 1);
		}
	}

	return (
		<>
			<form
				onSubmit={sendContactForm}
				noValidate
				onChange={(e) => {
					if (!isValidatedControl(e.target)) return;
					editedFields.current.add(e.target.name);
					// Checkboxes have no "while typing" phase; others re-check once flagged.
					if (e.target.type === "checkbox" || fieldErrors[e.target.name as ValidatedField]) validateField(e.target);
				}}
				onBlur={(e) => {
					if (isValidatedControl(e.target) && e.target.type !== "checkbox" && editedFields.current.has(e.target.name)) {
						validateField(e.target);
					}
				}}
				aria-label={t("formAriaLabel")}
				className={`mx-5 flex flex-col flex-nowrap items-center ${loading === "submitted" && "hidden"}`}>
				{/* w-fit: the input rows set this wrapper's width; the textarea
				    below then stretches to match them (first input's left edge to
				    the last input's right edge) on every breakpoint. */}
				<div className="flex flex-col w-fit">
					<div className="name-div flex flex-col lg:flex-row">
						<section className="flex flex-col">
							<label
								htmlFor="firstName"
								className="capitalize">
								{t("firstName")}
								<span
									className="text-(--error) required"
									aria-hidden="true"
								/>
								<span className="sr-only">({t("requiredIndicator")})</span>
							</label>
							<input
								type="text"
								name="firstName"
								id="firstName"
								autoComplete="given-name"
								required
								aria-required="true"
								{...errorProps("firstName")}
								className="bg-(--surface) ml-2 my-1 autofill:bg-(--secondary)
          peer user-invalid:border-(--error) user-valid:border-(--success) aria-invalid:border-(--error)"
							/>
							{renderFieldError("firstName")}
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
								autoComplete="family-name"
								className="bg-(--surface) ml-2 my-1 autofill:bg-(--secondary)
          peer user-invalid:border-(--error) user-valid:border-(--success)"
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
								<span
									className="text-(--error) required"
									aria-hidden="true"
								/>
								<span className="sr-only">({t("requiredIndicator")})</span>
							</label>
							<input
								type="email"
								name="email"
								id="email"
								autoComplete="email"
								required
								aria-required="true"
								{...errorProps("email")}
								className="bg-(--surface) ml-2 my-1 autofill:bg-(--secondary)
          peer user-invalid:border-(--error) user-valid:border-(--success) aria-invalid:border-(--error)"
							/>
							{renderFieldError("email")}
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
								autoComplete="tel"
								className="bg-(--surface) ml-2 my-1 autofill:bg-(--secondary)
						    peer user-invalid:border-(--error) user-valid:border-(--success)"
								aria-required="false"
							/>
						</section>
					</div>
					<section className="message-div flex flex-col">
						<label
							htmlFor="message"
							className="capitalize">
							{t("message")}
							<span
								className="text-(--error) required"
								aria-hidden="true"
							/>
							<span className="sr-only">({t("requiredIndicator")})</span>
						</label>
						<textarea
							name="message"
							id="message"
							rows={4}
							required
							aria-required="true"
							{...errorProps("message")}
							// w-0 + min-w: contributes no intrinsic width to the w-fit wrapper,
							// then fills it (minus the ml-2 offset shared with the inputs).
							className="w-0 min-w-[calc(100%-0.5rem)] bg-(--surface) ml-2 my-1 field-sizing-content min-h-[4lh] user-valid:border-(--success) autofill:bg-(--secondary) user-invalid:border-(--error) aria-invalid:border-(--error)"
							spellCheck
						/>
						{renderFieldError("message")}
					</section>
				</div>
				<div className="privacy-policy-req mt-1.5">
					<p className="align-start">
						<span className="text-(--error)">* </span>
						<span className="capitalize">{t("required")}</span>
					</p>
					<label htmlFor="privacy-policy-check">
						<input
							type="checkbox"
							name="privacy-policy-check"
							id="privacy-policy-check"
							className=" accent-(--primary) focus:shadow-(--primary)"
							required
							aria-required="true"
							{...errorProps("privacy-policy-check")}
						/>{" "}
						{t("privacyPolicyCheck")}{" "}
						{/* Plain Link (not TransitionLink): it must open in a new tab so the
						    visitor doesn't lose what they've typed.  The internal route key
						    is localized by next-intl (e.g. /de/datenschutz). */}
						<Link
							href="/privacy-policy"
							target="_blank"
							rel="noopener"
							className="underline">
							<span className="underline">{t("privacy")}</span>
						</Link>
						.
					</label>
					{renderFieldError("privacy-policy-check")}
				</div>

				<section className="flex flex-col justify-center items-center mx-auto mt-2.5">
					<div className={`${turnstileLoaded ? "" : "hidden"} max-w-[300px]`}>
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
								setError(t("errors.turnstileFailed"));
								setLoading("error");
							}}
							onExpire={() => {
								setTurnstileStatus("expired");
								setError(t("errors.turnstileExpired"));
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
							onVerify={(token) => {
								// The token is validated server-side inside the
								// submitContact action (tokens are single-use).
								setTurnstileToken(token);
								setTurnstileStatus("success");
								setError(null);
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
						<p
							className="text-(--secondary) text-xs mt-1 text-center"
							role="status">
							{t("errors.turnstileRequired")}
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
