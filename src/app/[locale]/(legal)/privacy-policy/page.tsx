/* eslint-disable react/prop-types */
/* eslint-disable react/no-multi-comp */
import { Locale, useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import { use } from "react";

/** Props for the Privacy Policy page, receiving locale from Next.js. */
interface Props {
	/** Promise resolving to an object with the locale. */
	params: Promise<{ locale: Locale }>;
}

/**
 * Generates localized metadata for the Privacy Policy page.
 *
 * @param props - Component props containing locale and search params.
 * @param props.params - Promise resolving to an object with the locale.
 * @param props.searchParams - Promise resolving to search parameters (unused but required by Next.js).
 * @returns Metadata object with localized title, description, canonical URL, and Open Graph data.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({
		locale: locale,
		namespace: "metadata",
	});

	return {
		title: t("title.privacyPolicy"),
		description: t("description.privacyPolicy"),
		alternates: {
			canonical: "https://daniel-freire.com",
			languages: {
				en: "https://daniel-freire.com/en",
				pt: "https://daniel-freire.com/pt",
			},
		},
		openGraph: {
			title: t("opengraphImageAlt"),
			description: t("description.privacyPolicy"),
			url: "https://daniel-freire.com",
			siteName: t("title.privacyPolicy"),
			images: [{ url: `https://daniel-freire.com/metadata/open-graph-initials5.png` }],
			locale: locale,
			type: "website",
		},
	};
}

/** Props for the ListParagraph component. */
interface ListParagraphProps {
	/** Array of translation keys to render as list items. */
	list: string[];
}

/**
 * Renders a list of translated paragraphs for the privacy policy sections.
 *
 * @param props - Component props.
 * @param props.list - Array of translation keys to render as list items.
 * @returns A fragment containing the translated list items.
 */
const ListParagraph: React.FC<ListParagraphProps> = ({ list }) => {
	return <>{Array.isArray(list) && list.map((item) => <li key={item}>{item}</li>)}</>;
};

/**
 * Privacy Policy page component.
 *
 * Renders the full privacy policy content with multiple sections,
 * each containing translated headings and paragraphs. Includes contact
 * email links and list items for specific sections.
 *
 * @returns The privacy policy section with legal content.
 */
const PrivacyPolicy = ({ params }: Props) => {
	const { locale } = use(params);
	setRequestLocale(locale);

	const t = useTranslations("privacyPolicy");

	return (
		<section className="m-7">
			<h2>{t("title")}</h2>
			<h3>{t("header1")}</h3>
			<p>
				{t("paragraph1")} <a href={`mailto:${t("contactEmail")}`}>{t("contactEmail")}</a>.
			</p>
			<h3>{t("header2")}</h3>
			<p>{t("paragraph2")}</p>
			<ul className="pl-2 list-inside list-disc">
				<ListParagraph list={Array.isArray(t.raw("paragraph2li")) ? t.raw("paragraph2li") : []} />
			</ul>

			<h3>{t("header3")}</h3>
			<p>{t("paragraph3")}</p>
			<h3>{t("header4")}</h3>
			<p>{t("paragraph4")}</p>
			<h3>{t("header5")}</h3>
			<p>{t("paragraph5")}</p>
			<h3>{t("header6")}</h3>
			<p>{t("paragraph6")}</p>
			<h3>{t("header7")}</h3>
			<p>{t("paragraph7")}</p>
			<ul className="pl-2 list-inside list-disc">
				<ListParagraph list={Array.isArray(t.raw("paragraph7li")) ? t.raw("paragraph7li") : []} />
			</ul>
			<h3>{t("header8")}</h3>
			<p>{t("paragraph8")}</p>
			<h3>{t("header9")}</h3>
			<p>{t("paragraph9")}</p>
			<h3>{t("header10")}</h3>
			<p>{t("paragraph10")}</p>
			<h3>{t("header11")}</h3>
			<p>
				{t("paragraph11")} <a href={`mailto:${t("contactEmail")}`}>{t("contactEmail")}</a>.
			</p>
		</section>
	);
};

export default PrivacyPolicy;
