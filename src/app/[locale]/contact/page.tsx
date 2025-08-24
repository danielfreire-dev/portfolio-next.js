import { getTranslations } from "next-intl/server";
import { Locale, useTranslations } from "next-intl";
import ContactForm from "@/ui/Components/ContactForm";
import { Metadata, ResolvingMetadata } from "next";

interface Props {
	params: Promise<{ locale: Locale }>;
	searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata(
	{ params, searchParams }: Props,
	parent: ResolvingMetadata,
): Promise<Metadata> {
	// Await the params Promise to get the actual locale value
	const { locale } = await params;
	const t = await getTranslations({
		locale: locale,
		namespace: "metadata",
	});
	// optionally access and extend (rather than replace) parent metadata
	const previousImages = (await parent).openGraph?.images || [];

	return {
		title: t("title.contact"),
		description: t("description.contact"),
		alternates: {
			canonical: "https://daniel-freire.com",
			languages: {
				en: "https://daniel-freire.com/en",
				pt: "https://daniel-freire.com/pt",
			},
		},
		openGraph: {
			title: t("opengraphImageAlt"),
			description: t("description.contact"),
			url: "https://daniel-freire.com",
			siteName: t("title.contact"),
			images: [
				{ url: "https://daniel-freire.com/metadata/open-graph.png" },
				...previousImages,
			],
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
			<ContactForm />
		</>
	);
};

export default Contact;
