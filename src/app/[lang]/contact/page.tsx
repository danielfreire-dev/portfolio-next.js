import { Metadata } from "next";
import ContactForm from "./ContactForm";
import { Suspense } from "react";
import { Locale } from "@/src/i18n/i18n-config";
import { getDictionary } from "@/src/i18n/get-dictionary";

export const metadata: Metadata = {
	title: "Contact",
};

const Contact = async (props: { params: Promise<{ lang: Locale }> }) => {
	const { lang } = await props.params;

	const dictionary = await getDictionary(lang);
	return (
		<>
			<h2 className="text-2xl font-bold mx-auto text-center capitalize mb-4">
				{dictionary.contact.pageTitle}
			</h2>{" "}
			<Suspense fallback={<div>Loading...</div>}>
				<ContactForm contact={dictionary.contact} />
			</Suspense>
		</>
	);
};

export default Contact;
