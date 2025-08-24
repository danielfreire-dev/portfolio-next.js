/* eslint-disable react/prop-types */
/* eslint-disable react/no-multi-comp */
import { Locale, useTranslations } from "next-intl";
import { nanoid } from "nanoid";
import { getTranslations } from "next-intl/server";
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
			images: [
				{ url: "https://daniel-freire.com/metadata/open-graph.png" },
				...previousImages,
			],
		},
	};
}

interface ListParagraphProps {
	list: string[];
}

const ListParagraph: React.FC<ListParagraphProps> = ({ list }) => {
	return (
		<>
			{Array.isArray(list) &&
				list.map((item) => <li key={nanoid()}>{item}</li>)}
		</>
	);
};

const PrivacyPolicy = () => {
	const t = useTranslations("privacyPolicy");

	return (
		<section className="m-7">
			<h2>{t("title")}</h2>
			<h3>{t("header1")}</h3>
			<p>
				{t("paragraph1")}{" "}
				<a href={`mailto:${t("contactEmail")}`}>{t("contactEmail")}</a>.
			</p>
			<h3>{t("header2")}</h3>
			<p>{t("paragraph2")}</p>
			<ul className="pl-2 list-inside list-disc">
				<ListParagraph
					list={
						Array.isArray(t.raw("paragraph2li")) ? t.raw("paragraph2li") : []
					}
				/>
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
				<ListParagraph
					list={
						Array.isArray(t.raw("paragraph7li")) ? t.raw("paragraph7li") : []
					}
				/>
			</ul>
			<h3>{t("header8")}</h3>
			<p>{t("paragraph8")}</p>
			<h3>{t("header9")}</h3>
			<p>{t("paragraph9")}</p>
			<h3>{t("header10")}</h3>
			<p>{t("paragraph10")}</p>
			<h3>{t("header11")}</h3>
			<p>
				{t("paragraph11")}{" "}
				<a href={`mailto:${t("contactEmail")}`}>{t("contactEmail")}</a>.
			</p>
		</section>
	);
};

export default PrivacyPolicy;
