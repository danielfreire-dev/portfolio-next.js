"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect, useCallback } from "react";
import styles from "@/ui/styles/CookieBanner.module.css";

/** Granular consent categories the user can toggle. */
type ConsentPrefs = {
	analytics: boolean;
	social: boolean;
	marketing: boolean;
};

const STORAGE_KEY = "cookie-consent";

/**
 * Reads previously-saved cookie consent preferences from localStorage.
 *
 * Prevents the consent banner from re-appearing on subsequent visits by
 * hydrating the user's prior consent choices. Returns `null` when running
 * server-side (SSR) or when the stored JSON is malformed, so the component
 * treats the user as a first-time visitor.
 *
 * @returns The saved consent preferences or `null` if unavailable.
 */
function loadConsent(): { prefs: ConsentPrefs } | null {
	if (typeof window === "undefined") return null;
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw) as { prefs?: ConsentPrefs };
		if (!parsed.prefs) return null;
		return { prefs: parsed.prefs };
	} catch {
		return null;
	}
}

/**
 * Persists cookie consent preferences to localStorage.
 *
 * Saves the user's consent choices alongside a timestamp so the banner can
 * stay hidden on future visits. Silently ignores storage failures (quota
 * exceeded, private browsing restrictions) rather than blocking the UX.
 *
 * @param prefs - The consent preferences to persist.
 */
function saveConsent(prefs: ConsentPrefs) {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify({ prefs, timestamp: Date.now() }));
	} catch {
		/* Storage full or unavailable — silently ignore */
	}
}

/**
 * Grants analytics consent by updating the Google Analytics gtag defaults.
 *
 * Called whenever the user accepts analytics cookies (via Accept All or
 * the granular Manage modal). Updates the consent state from `denied` to
 * `granted` so GA4 can begin tracking page views and events.
 */
function grantAnalytics() {
	if (typeof window !== "undefined" && window.gtag) {
		window.gtag("consent", "update", { analytics_storage: "granted" });
	}
}

/**
 * Root providers wrapper that replaces the `react-cookie-manager` library.
 *
 * Renders a fixed bottom cookie-consent banner with Accept All / Decline All /
 * Manage buttons. The Manage button opens a modal with granular toggles for
 * Analytics, Social and Advertising cookies (Essential is always on).
 *
 * Consent is persisted to `localStorage` so the banner stays hidden once the
 * user has made a choice. Granting analytics consent calls `window.gtag` to
 * update Google Analytics consent defaults. While hydrating from localStorage
 * on first render, only children are rendered to avoid a banner flash.
 */
export function Providers({ children }: { children: React.ReactNode }) {
	const t = useTranslations("cookies");

	const [showBanner, setShowBanner] = useState(false);
	const [showManage, setShowManage] = useState(false);
	const [consent, setConsent] = useState<ConsentPrefs>({
		analytics: false,
		social: false,
		marketing: false,
	});
	const [hydrated, setHydrated] = useState(false);

	useEffect(() => {
		const stored = loadConsent();
		if (stored) {
			setConsent(stored.prefs);
			if (stored.prefs.analytics) grantAnalytics();
		} else {
			setShowBanner(true);
		}
		setHydrated(true);
	}, []);

	const grantAll = useCallback(() => {
		const prefs: ConsentPrefs = { analytics: true, social: true, marketing: true };
		setConsent(prefs);
		saveConsent(prefs);
		setShowBanner(false);
		grantAnalytics();
	}, []);

	const declineAll = useCallback(() => {
		const prefs: ConsentPrefs = { analytics: false, social: false, marketing: false };
		setConsent(prefs);
		saveConsent(prefs);
		setShowBanner(false);
	}, []);

	const handleManageSave = useCallback(() => {
		saveConsent(consent);
		setShowBanner(false);
		setShowManage(false);
		if (consent.analytics) grantAnalytics();
	}, [consent]);

	if (!hydrated) {
		return <>{children}</>;
	}

	return (
		<>
			{children}

			{/* ---- Cookie Consent Banner ---- */}
			{showBanner  && (
					<div
						className={`fixed bottom-4 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 z-99999 w-auto sm:w-full sm:max-w-5xl rounded-xl sm:rounded-none ${styles?.banner ?? ""}`}
						style={{
							borderTop: "3px solid var(--primary)",
							boxShadow: "0 -4px 24px rgba(0, 0, 0, 0.18)",
						}}
						role="region"
						aria-label={t("title")}>
						<div
							className="px-4 py-3 sm:px-6 sm:py-4 mx-auto max-w-5xl flex flex-col gap-3 sm:gap-4"
							style={{ backgroundColor: "var(--surface)", color: "var(--text)" }}>
							{/* Message */}
							<div className="flex-1 min-w-0">
								<h3
									className="text-sm sm:text-base font-semibold mb-0.5"
									style={{ color: "var(--text)" }}>
									{t("title")}
								</h3>
								<p
									className="text-xs sm:text-sm leading-relaxed"
									style={{ color: "var(--text)" }}>
									{t("message")}
								</p>
							</div>

							{/* Buttons */}
							<div className="flex flex-wrap items-center gap-2 shrink-0">
								<button
									onClick={grantAll}
									type="button"
									className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all hover:brightness-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--primary)"
									style={{
										backgroundColor: "var(--primary)",
										color: "#fff",
									}}>
									{t("buttonText")}
								</button>
								<button
									onClick={declineAll}
									type="button"
									className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors hover:brightness-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--primary)"
									style={{
										backgroundColor: "var(--surface-hover)",
										color: "var(--text)",
									}}>
									{t("declineButtonText")}
								</button>
								<button
									onClick={() => setShowManage(true)}
									type="button"
									className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors hover:brightness-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--primary)"
									style={{
										backgroundColor: "var(--surface-hover)",
										color: "var(--text)",
									}}>
									{t("manageButtonText")}
								</button>
								<a
									href={t("privacyurl")}
									className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors hover:brightness-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--primary) underline underline-offset-2"
									style={{ color: "var(--primary)" }}>
									{t("privacyPolicyText")}
								</a>
							</div>
						</div>
					</div>
				)
			}

			{/* ---- Manage Preferences Modal ---- */}
			{showManage && (
				<div
					className="fixed inset-0 z-99999 flex items-center justify-center p-4"
					role="dialog"
					aria-modal="true"
					aria-label={t("manageTitle")}>
					{/* Backdrop */}
					<div
						className={`absolute inset-0 ${styles?.backdrop ?? ""}`}
						onClick={() => setShowManage(false)}
						aria-hidden="true"
					/>

					{/* Modal panel */}
					<div
						className="relative w-full max-w-lg rounded-xl shadow-lg p-5 sm:p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto"
						style={{
							backgroundColor: "var(--surface)",
							color: "var(--text)",
						}}>
						<h3
							className="text-lg font-semibold"
							style={{ color: "var(--text)" }}>
							{t("manageTitle")}
						</h3>
						<p
							className="text-sm leading-relaxed"
							style={{ color: "var(--text)" }}>
							{t("manageMessage")}
						</p>

						{/* Essential — always enabled, read-only */}
						<div className="flex items-center justify-between py-2 border-b border-black/10">
							<div>
								<h4
									className="text-sm font-medium"
									style={{ color: "var(--text)" }}>
									{t("manageEssentialTitle")}
								</h4>
								<p
									className="text-xs"
									style={{ color: "var(--text-tertiary)" }}>
									{t("manageEssentialSubtitle")}
								</p>
								<p
									className="text-xs mt-0.5"
									style={{ color: "var(--text-tertiary)" }}>
									{t("manageEssentialStatus")}
								</p>
							</div>
							<div className={`${styles?.toggle ?? ""} ${styles?.toggleChecked ?? ""} ${styles?.toggleDisabled ?? ""}`}>
								<input
									type="checkbox"
									checked
									disabled
									className={styles?.toggleInput ?? ""}
									aria-label={t("manageEssentialTitle")}
								/>
								<span className={styles?.toggleKnob ?? ""} />
							</div>
						</div>

						{/* Analytics */}
						<div className="flex items-center justify-between py-2 border-b border-black/10">
							<div>
								<h4
									className="text-sm font-medium"
									style={{ color: "var(--text)" }}>
									{t("manageAnalyticsTitle")}
								</h4>
								<p
									className="text-xs"
									style={{ color: "var(--text-tertiary)" }}>
									{t("manageAnalyticsSubtitle")}
								</p>
							</div>
							<div className={`${styles?.toggle ?? ""} ${consent.analytics ? (styles?.toggleChecked ?? "") : ""}`}>
								<input
									type="checkbox"
									checked={consent.analytics}
									onChange={(e) => setConsent((c) => ({ ...c, analytics: e.target.checked }))}
									className={styles?.toggleInput ?? ""}
									aria-label={t("manageAnalyticsTitle")}
								/>
								<span className={styles?.toggleKnob ?? ""} />
							</div>
						</div>

						{/* Social */}
						<div className="flex items-center justify-between py-2 border-b border-black/10">
							<div>
								<h4
									className="text-sm font-medium"
									style={{ color: "var(--text)" }}>
									{t("manageSocialTitle")}
								</h4>
								<p
									className="text-xs"
									style={{ color: "var(--text-tertiary)" }}>
									{t("manageSocialSubtitle")}
								</p>
							</div>
							<div className={`${styles?.toggle ?? ""} ${consent.social ? (styles?.toggleChecked ?? "") : ""}`}>
								<input
									type="checkbox"
									checked={consent.social}
									onChange={(e) => setConsent((c) => ({ ...c, social: e.target.checked }))}
									className={styles?.toggleInput ?? ""}
									aria-label={t("manageSocialTitle")}
								/>
								<span className={styles?.toggleKnob ?? ""} />
							</div>
						</div>

						{/* Advertising */}
						<div className="flex items-center justify-between py-2 border-b border-black/10">
							<div>
								<h4
									className="text-sm font-medium"
									style={{ color: "var(--text)" }}>
									{t("manageAdvertTitle")}
								</h4>
								<p
									className="text-xs"
									style={{ color: "var(--text-tertiary)" }}>
									{t("manageAdvertSubtitle")}
								</p>
							</div>
							<div className={`${styles?.toggle ?? ""} ${consent.marketing ? (styles?.toggleChecked ?? "") : ""}`}>
								<input
									type="checkbox"
									checked={consent.marketing}
									onChange={(e) => setConsent((c) => ({ ...c, marketing: e.target.checked }))}
									className={styles?.toggleInput ?? ""}
									aria-label={t("manageAdvertTitle")}
								/>
								<span className={styles?.toggleKnob ?? ""} />
							</div>
						</div>

						{/* Actions */}
						<div className="flex flex-wrap justify-end gap-2 mt-2">
							<button
								onClick={() => setShowManage(false)}
								type="button"
								className="px-4 py-2 text-sm font-medium rounded-lg transition-colors hover:brightness-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--primary)"
								style={{
									backgroundColor: "var(--surface-hover)",
									color: "var(--text)",
								}}>
								{t("manageCancelButtonText")}
							</button>
							<button
								onClick={handleManageSave}
								type="button"
								className="px-4 py-2 text-sm font-semibold rounded-lg transition-all hover:brightness-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--primary)"
								style={{
									backgroundColor: "var(--primary)",
									color: "#fff",
								}}>
								{t("manageSaveButtonText")}
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
