import { Locale } from "@/src/i18n/i18n-config";
import Sidenav from "./Sidenav";
import { Dictionary } from "@/src/types";

export default function SidenavContainer({
	dictionary,
}: {
	dictionary: Dictionary;
}) {
	return <Sidenav dictionary={dictionary.sidenav} />;
}
