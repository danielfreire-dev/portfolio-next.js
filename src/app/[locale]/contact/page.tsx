import { getTranslations, setRequestLocale } from "next-intl/server";
import { Locale, useTranslations } from "next-intl";
import ContactForm from "@/ui/Components/ContactForm";
import { Metadata } from "next";
import { use } from "react";
import { generateBreadcrumbSchema, generateContactPointSchema } from "@/ui/Components/StructuredData";
import { getAlternates } from "@/i18n/alternates";

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
	const { locale } = await params;
	const t = await getTranslations({
		locale: locale,
		namespace: "metadata",
	});

	return {
		title: t("title.contact"),
		description: t("description.contact"),
		keywords: [
			"contact web developer",
			"hire developer",
			"freelance web developer Portugal",
			"get in touch",
			"web development inquiry",
		],
		robots: { index: true, follow: true },
		alternates: getAlternates({ href: "/contact", locale }),
		openGraph: {
			type: "website",
			title: t("title.contact"),
			description: t("description.contact"),
			url: "https://daniel-freire.com/contact",
			siteName: t("title.contact"),
			images: [{ url: "https://daniel-freire.com/metadata/open-graph-initials5.png", width: 1200, height: 630 }],
			locale: locale,
		},
		twitter: {
			card: "summary_large_image",
			title: t("title.contact"),
			description: t("description.contact"),
			images: ["https://daniel-freire.com/metadata/open-graph-initials5.png"],
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
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify([
						generateBreadcrumbSchema([
							{ name: "Home", href: `/${locale}` },
							{ name: "Contact", href: `/${locale}/contact` },
						]),
						generateContactPointSchema(),
					]),
				}}
			/>
			<h2 className="text-2xl font-bold mx-auto text-center capitalize mb-4">{t("pageTitle")}</h2>

			<ContactForm />
		</>
	);
};

export default Contact;
