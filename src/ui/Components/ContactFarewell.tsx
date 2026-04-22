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
 */
const ContactFarewell = ({ submitted }: ContactFarewellProps) => {
  const t = useTranslations("contact");

  return (
    <div className={`mx-auto ${!submitted && "hidden"}`}>
      <h2 className="capitalize text-center">{t("farewell.title")}</h2>
      <p className="text-center">{t("farewell.text")}</p>
    </div>
  );
};

export default ContactFarewell;
