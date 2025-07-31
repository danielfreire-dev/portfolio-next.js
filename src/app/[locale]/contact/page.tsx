import { Metadata } from "next";
import ContactForm from "./ContactForm";
import { Suspense } from "react";
import { useTranslations } from "next-intl";

export const metadata: Metadata = {
	title: "Contact",
};

const Contact = () => {
	const t = useTranslations("contact");
	return (
		<>
			<h2 className="text-2xl font-bold mx-auto text-center capitalize mb-4">
				{t("pageTitle")}
			</h2>{" "}
			<Suspense fallback={<div>Loading...</div>}>
				<ContactForm />
			</Suspense>
		</>
	);
};

export default Contact;
