"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import "@/ui/styles/cookieBanner.css";
import { useState, useEffect } from "react";
/* import "@/ui/styles/cookieBannerOG.css"; */
import { NextHogProvider, posthog, updatePostHogConsent } from "./posthog";

const CookieManager = dynamic(
	() => import("react-cookie-manager").then((mod) => mod.CookieManager),
	{ ssr: false, loading: () => null },
);

export function Providers({ children }: { children: React.ReactNode }) {
	const [cookieConsentGiven, setCookieConsentGiven] = useState({
		analytics: false,
		social: false,
		marketing: false,
	});

	const t = useTranslations("cookies");

	const consentAnalytics = () => {
		posthog.opt_in_capturing();
		setCookieConsentGiven({ ...cookieConsentGiven, analytics: true });
		window.gtag("consent", "update", {
			analytics_storage: "granted",
		});
	};
	const consentSocial = () => {
		setCookieConsentGiven({ ...cookieConsentGiven, social: true });
	};
	const consentMarketing = () => {
		setCookieConsentGiven({ ...cookieConsentGiven, marketing: true });
	};

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
				console.log("Custom preferences saved:", preferences);
				// Handle granular consent
				if (preferences?.Analytics) {
					consentAnalytics();
				}
				if (preferences?.Advertising) {
					consentMarketing();
				}
				if (preferences?.Social) {
					consentSocial();
				}
			}}
			onAccept={() => {
				console.log("User accepted all cookies");
				consentAnalytics();
				consentSocial();
				consentMarketing();
			}}
			onDecline={() => {
				console.log("User declined all cookies");
				updatePostHogConsent("denied");
				posthog.opt_out_capturing();
			}}
			classNames={{
				manageCookieToggleChecked: "toggle-checked",
			}}
		>
			{/* {children} */}
			<NextHogProvider>{children}</NextHogProvider>
		</CookieManager>
	);
}
