import { useTranslations } from "next-intl";

interface ContactFarewellProps {
	submitted: boolean;
}

const ContactFarewell = ({ submitted }: ContactFarewellProps) => {
	const t = useTranslations("contact");

	/* if (!submitted) {
		return null;
	} */

	return (
		<div className={`mx-auto ${!submitted && "hidden"}`}>
			<h2 className="capitalize text-center">{t("farewell.title")}</h2>
			<p className="text-center">{t("farewell.text")}</p>
		</div>
	);
};

export default ContactFarewell;
