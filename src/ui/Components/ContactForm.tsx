"use client";

import { getData } from "@/lib/getData";
import { sendEmail } from "@/lib/resend";
/* import { sendEmail } from "@/app/api/send"; */
import "@/ui/styles/border.css";
import { useTranslations } from "next-intl";
import { Suspense, useEffect, useRef, useState } from "react";
import ContactFarewell from "./ContactFarewell";
import { TransitionLink } from "./Sidenav/TransitionLink";
import { Turnstile } from "next-turnstile";
import { useThemeStore } from "@/stores/theme-store";

const ContactForm = () => {
  type submission = "idle" | "loading" | "loaded" | "error" | "submitted";
  const [loading, setLoading] = useState<submission>("idle"); //og false
  const [turnstileStatus, setTurnstileStatus] = useState<
    "success" | "error" | "expired" | "required"
  >("required");
  const [error, setError] = useState<string | null>(null);
  const [turnstileLoaded, setTurnstileLoaded] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const t = useTranslations("contact");
  const { isDarkStore, setValue } = useThemeStore();
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    setAnimationKey((prev) => prev + 1);
  }, [isDarkStore]);

  async function sendContactForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    /* captureButtonClick(); */

    setLoading("loading");

    if (turnstileStatus !== "success") {
      setError("Please verify you are not a robot");
      setLoading("error");
      return;
    }

    const formData = new FormData(e.currentTarget);

    const formValues = Object.fromEntries(formData);
    const token = formData.get("cf-turnstile-response");
    await sendEmail(formValues);
    await getData(formValues);

    setLoading("submitted");
  }
  return (
    <>
      {/* TODO: Add form input sanitation */}
      <form
        onSubmit={sendContactForm}
        className={`mx-5 flex flex-col flex-nowrap items-center ${loading === "submitted" && "hidden"}`}
      >
        <div className="name-div flex flex-col lg:flex-row">
          <Suspense fallback={<p>Loading...</p>}>
            <section className="flex flex-col">
              <label htmlFor="firstName" className="capitalize">
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
              <label htmlFor="lastName" className="capitalize">
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
              <label htmlFor="email" className="capitalize">
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
              <label htmlFor="telephone" className="capitalize">
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
            <label htmlFor="message" className="capitalize">
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
              className="underline"
            >
              <span className="underline">{t("privacy")}</span>
            </TransitionLink>
            .
          </label>
        </div>

        <section className="flex flex-col justify-center mx-auto mt-2.5">
          <Suspense>
            <Turnstile
              key={`turnstile-${isDarkStore ? "dark" : "light"}-${animationKey}`}
              siteKey={siteKey!}
              retry="auto"
              refreshExpired="auto"
              sandbox={process.env.NODE_ENV === "development"}
              appearance="execute"
              theme={isDarkStore ? "dark" : "light"}
              className="turnstile-transition turnstile-animated"
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
                setTurnstileStatus("required");
                setError(null);
                setTurnstileLoaded(true); // Set this to trigger button animation
              }}
              onVerify={(token) => {
                setTurnstileStatus("success");
                setError(null);
                setLoading("error");
              }}
            />
          </Suspense>
          <button
            type="submit"
            className={`bg-(--surface) raise capitalize button-class ${turnstileLoaded ? "button-class-animate-in" : "button-class-initially-hidden"}`}
            id="contact-form"
            disabled={loading === "loading" || turnstileStatus !== "success"}
          >
            {t("btn")}
          </button>
        </section>
      </form>
      <ContactFarewell submitted={loading === "submitted"} />
    </>
  );
};

export default ContactForm;
