import { getTranslations, setRequestLocale } from "next-intl/server";
import { Locale, NextIntlClientProvider, useMessages, useTranslations } from "next-intl";
import { CONTACT_CLIENT_MESSAGES, pickMessages } from "@/i18n/clientMessages";
import ContactForm from "@/ui/Components/ContactForm";
import { Metadata } from "next";
import { use } from "react";
import { generateBreadcrumbSchema } from "@/ui/Components/StructuredData";
import { getCanonicalUrl } from "@/i18n/alternates";
import { buildPageMetadata } from "@/i18n/pageMetadata";

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

	return buildPageMetadata({
		href: "/contact",
		locale,
		title: t("seoTitle.contact"),
		description: t("description.contact"),
		keywords: [
			"contact web developer",
			"hire developer",
			"freelance web developer",
			"get in touch",
			"web development inquiry",
		],
	});
}

/**
 * Contact page — renders the page title and the contact form.
 *
 * The ContactPoint structured data lives in the global Person schema
 * (see `generatePersonSchema`), so only the breadcrumb is emitted here.
 *
 * Route: /[locale]/contact
 */
const Contact = ({ params }: Props) => {
	const { locale } = use(params);
	setRequestLocale(locale);

	const t = useTranslations("contact");
	const m = useTranslations("metadata.title");
	const b = useTranslations("breadcrumbs");
	const messages = useMessages();
	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(
						generateBreadcrumbSchema([
							{ name: b("home"), href: getCanonicalUrl("/", locale) },
							{ name: m("contact"), href: getCanonicalUrl("/contact", locale) },
						]),
					),
				}}
			/>
			<h1 className="text-2xl font-bold mx-auto text-center capitalize mb-4">{t("pageTitle")}</h1>

			<NextIntlClientProvider messages={pickMessages(messages, CONTACT_CLIENT_MESSAGES)}>
				<ContactForm />
			</NextIntlClientProvider>
		</>
	);
};

export default Contact;
