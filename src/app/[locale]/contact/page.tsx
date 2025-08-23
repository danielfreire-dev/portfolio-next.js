import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import ContactForm from "@/ui/Components/ContactForm";

interface Params {
	locale: string;
}
export async function generateMetadata({
	params,
}: {
	params: Params;
}): Promise<{
	title: string;
	description: string;
}> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "metadata" });

	return {
		title: t("title.contact"),
		description: t("description.contact"),
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
