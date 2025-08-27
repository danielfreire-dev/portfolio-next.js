import { useTranslations } from "next-intl";

const NotFoundPage = () => {
	const t = useTranslations("error");
	return (
		<div className="flex flex-col items-center">
			<h2 className="capitalize">{t("404")}</h2>
			<h3 className="capitalize mt-3">{t("errorLoading.title")}</h3>
			<p className="mt-2">{t("description")}</p>
			{t.rich("errorLoading.contact", {
				p: (chunks) => <p className="mt-1">{chunks}</p>,
				a: (chunks) => (
					<a className="underline" href="mailto:webmaster@daniel-freire.com">
						{chunks}
					</a>
				),
			})}
		</div>
	);
};
export default NotFoundPage;
