import { Metadata } from "next";
import ClientSideAbout from "./ClientPage";
import { Suspense } from "react";
import { Locale } from "@/src/i18n/i18n-config";
import { getDictionary } from "@/src/i18n/get-dictionary";

export const metadata: Metadata = {
	title: "About",
};

const About = async (props: { params: Promise<{ lang: Locale }> }) => {
	const { lang } = await props.params;

	const dictionary = await getDictionary(lang);

	return (
		<Suspense fallback={<div>Loading...</div>}>
			<ClientSideAbout about={dictionary.about} dictionary={dictionary} />
		</Suspense>
	);
};

export default About;
