/* eslint-disable react/prop-types */
/* eslint-disable react/no-multi-comp */
import { useTranslations } from "next-intl";
import { nanoid } from "nanoid";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: any }): Promise<{
	title: string;
}> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "metadata" });

	return {
		title: t("privacyPolicy"),
	};
}

interface ListParagraphProps {
	list: string[];
}

const PrivacyPolicy = () => {
	const t = useTranslations("privacyPolicy");

	const ListParagraph: React.FC<ListParagraphProps> = ({ list }) => {
		return (
			<>
				{Array.isArray(list) &&
					list.map((item) => <li key={nanoid()}>{item}</li>)}
			</>
		);
	};

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
