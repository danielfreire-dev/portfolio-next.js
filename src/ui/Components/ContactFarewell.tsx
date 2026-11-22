import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";

/** Props for the contact farewell component. */
interface ContactFarewellProps {
  /** Whether the contact form has been successfully submitted. */
  submitted: boolean;
}

/**
 * Post-submission farewell message.
 *
 * Displays a thank-you message after the contact form has been successfully
 * submitted. Hidden via CSS when `submitted` is `false`.
 *
 * On submission the form (and the focused submit button) disappears, so focus
 * moves to the heading here: keyboard users keep their place and screen
 * readers announce the confirmation (WCAG 2.4.3, 4.1.3).
 */
const ContactFarewell = ({ submitted }: ContactFarewellProps) => {
  const t = useTranslations("contact");
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (submitted) headingRef.current?.focus();
  }, [submitted]);

  return (
    <div className={`mx-auto ${!submitted && "hidden"}`}>
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="capitalize text-center focus:outline-none">
        {t("farewell.title")}
      </h2>
      <p className="text-center">{t("farewell.text")}</p>
    </div>
  );
};

export default ContactFarewell;
