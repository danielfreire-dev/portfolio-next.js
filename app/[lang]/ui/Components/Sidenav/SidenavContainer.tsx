import Sidenav from "./Sidenav";
import { getDictionary } from "@/app/i18n/get-dictionary";
import { Locale } from "./i18n/i18n-config";

export default async function SidenavContainer(props: {
	children: React.ReactNode;
	params: Promise<{ lang: Locale }>;
}) {
	const { lang } = await props.params;

	const dictionary = await getDictionary(lang);

	return <Sidenav dictionary={dictionary.sidenav} />;
}
