import { getTranslations } from "next-intl/server";
import { Locale, useTranslations } from "next-intl";
import ContactForm from "@/ui/Components/ContactForm";
import { Metadata } from "next";
import { ReCaptchaProvider } from "next-recaptcha-v3";
interface Props {
	params: Promise<{ locale: Locale }>;
	searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({
	params,
	searchParams,
}: Props): Promise<Metadata> {
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
			images: [
				{ url: `https://daniel-freire.com/metadata/open-graph-initials5.png` },
			],
			locale: locale,
			type: "website",
		},
	};
}

const Contact = () => {
	const t = useTranslations("contact");
	return (
		<>
			<h2 className="text-2xl font-bold mx-auto text-center capitalize mb-4">
				{t("pageTitle")}
			</h2>
			{/* <ReCaptchaProvider
				reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
			>
				<ContactForm />
			</ReCaptchaProvider> */}
			<ContactForm />
		</>
	);
};

export default Contact;
