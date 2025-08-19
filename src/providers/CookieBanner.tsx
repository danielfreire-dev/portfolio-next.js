"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import "@/ui/styles/cookieBanner.css";
/* import "@/ui/styles/cookieBannerOG.css"; */
/* import { PostHogProvider } from "./posJavali"; */

const CookieManager = dynamic(
	() => import("react-cookie-manager").then((mod) => mod.CookieManager),
	{ ssr: false, loading: () => null },
);

export function Providers({ children }: { children: React.ReactNode }) {
	const t = useTranslations("cookies");

	return (
		<CookieManager
			cookieKitId={process.env.NEXT_PUBLIC_cookieKitId}
			translations={{
				title: t("title"),
				message: t("message"),
				buttonText: t("buttonText"),
				declineButtonText: t("declineButtonText"),
				privacyPolicyText: t("privacyPolicyText"),
				manageButtonText: t("manageButtonText"),

				manageTitle: t("manageTitle"),
				manageMessage: t("manageMessage"),

				manageEssentialTitle: t("manageEssentialTitle"),
				manageEssentialSubtitle: t("manageEssentialSubtitle"),
				manageEssentialStatus: t("manageEssentialStatus"),
				manageEssentialStatusButtonText: t("manageEssentialStatusButtonText"),

				manageAnalyticsTitle: t("manageEssentialStatusButtonText"),
				manageAnalyticsSubtitle: t("manageAnalyticsSubtitle"),

				manageSocialTitle: t("manageSocialTitle"),
				manageSocialSubtitle: t("manageSocialSubtitle"),

				manageAdvertTitle: t("manageAdvertTitle"),
				manageAdvertSubtitle: t("manageAdvertSubtitle"),

				/* manageCookiesStatus: t("manageCookiesStatus"), */
				manageCookiesStatusConsented: t("manageCookiesStatusConsented"),
				manageCookiesStatusDeclined: t("manageCookiesStatusDeclined"),

				manageCancelButtonText: t("manageCancelButtonText"),
				manageSaveButtonText: t("manageSaveButtonText"),
			}}
			showManageButton
			privacyPolicyUrl={t("privacyurl")}
			displayType="modal"
			onManage={(preferences) => {
				if (preferences) {
					console.log("Cookie preferences updated:", preferences);
				}
			}}
			onAccept={() => {
				console.log("User accepted all cookies");
				// Analytics tracking can be initialized here
			}}
			onDecline={() => {
				console.log("User declined all cookies");
				// Handle declined state if needed
			}}
			classNames={{
				manageCookieToggleChecked: "toggle-checked",
			}}
		>
			{children}
			{/* <PostHogProvider>{children}</PostHogProvider> */}
		</CookieManager>
	);
}
