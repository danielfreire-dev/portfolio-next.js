import { getTranslations, setRequestLocale } from "next-intl/server";
import { Locale, useTranslations } from "next-intl";
import ContactForm from "@/ui/Components/ContactForm";
import { Metadata } from "next";
import { use } from "react";

interface Props {
	params: Promise<{ locale: Locale }>;
}

/**
 * Generates localized metadata for the contact page.
 *
 * Fetches translated title, description, and Open Graph data based on the
 * resolved locale from the route params.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
	// Await the params Promise to get the actual locale value
	const { locale } = await params;
	const t = await getTranslations({
		locale: locale,
		namespace: "metadata",
	});

	return {
		title: t("title.contact"),
		description: t("description.contact"),
		alternates: {
			canonical: "https://daniel-freire.com/contact",
			languages: {
				en: "https://daniel-freire.com/en/contact",
				pt: "https://daniel-freire.com/pt/contactos",
			},
		},
		openGraph: {
			title: t("opengraphImageAlt"),
			description: t("description.contact"),
			url: "https://daniel-freire.com",
			siteName: t("title.contact"),
			images: [{ url: `https://daniel-freire.com/metadata/open-graph-initials5.png` }],
			locale: locale,
			type: "website",
		},
	};
}

/**
 * Contact page — renders the page title and the contact form.
 *
 * Route: /[locale]/contact
 */
const Contact = ({ params }: Props) => {
	const { locale } = use(params);
	setRequestLocale(locale);

	const t = useTranslations("contact");
	return (
		<>
			<h2 className="text-2xl font-bold mx-auto text-center capitalize mb-4">{t("pageTitle")}</h2>

			<ContactForm />
		</>
	);
};

export default Contact;
