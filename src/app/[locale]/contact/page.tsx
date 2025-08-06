import { getTranslations } from "next-intl/server";
import ContactForm from "./ContactForm";
import { Suspense } from "react";
import { useTranslations } from "next-intl";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function generateMetadata({ params }: { params: any }): Promise<{
	title: string;
}> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "metadata" });

	return {
		title: t("contact"),
	};
}

const Contact = () => {
	const t = useTranslations("contact");
	return (
		<>
			<h2 className="text-2xl font-bold mx-auto text-center capitalize mb-4">
				{t("pageTitle")}
			</h2>{" "}
			<Suspense fallback={<div>Loading...</div>}>
				<ContactForm />
			</Suspense>
		</>
	);
};

export default Contact;
