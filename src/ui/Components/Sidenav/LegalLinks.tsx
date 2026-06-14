import { useTranslations } from "next-intl";
import { TransitionLink } from "./TransitionLink";

/**
 * LegalLinks - Renders a link to the privacy policy page.
 *
 * Uses the `sidenav` translation namespace for accessible labels and display text.
 */
const LegalLinks = () => {
  const t = useTranslations("sidenav");
  const url = t("legal.privacyLink") as "/privacy-policy";

  return (
    <div className="flex flex-nowrap justify-center capitalize underline italic">
      <TransitionLink
        href={url}
        ariaLabel={t("legal.privacyLinkAriaLabel")}
        title={t("legal.privacyLinkTitle")}
        ariaDetails={t("legal.privacyLinkAriaDetails")}
      >
        {t("legal.privacyName")}
      </TransitionLink>
      {/* <Link href={t("legal.impressumLink")} className="hidden">
				{t("legal.impressumName")}
			</Link> */}
    </div>
  );
};
export default LegalLinks;
