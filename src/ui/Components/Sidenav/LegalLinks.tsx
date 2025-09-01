import Link from "next/link";
import { useTranslations } from "next-intl";

const LegalLinks = () => {
	const t = useTranslations("sidenav");
	return (
		<div className="flex flex-nowrap justify-center capitalize underline italic">
			<Link href={t("legal.privacyLink")}>{t("legal.privacyName")}</Link>
			{/* <Link href={t("legal.impressumLink")} className="hidden">
				{t("legal.impressumName")}
			</Link> */}
		</div>
	);
};
export default LegalLinks;
