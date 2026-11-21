"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { CONSENT_STORAGE_KEY } from "./CookieBanner";

declare global {
	interface Window {
		gtag: any;
	}
}

/**
 * Google Analytics 4 integration component.
 *
 * Injects the GA4 script tag and initialises gtag. The consent default is
 * `denied` unless the visitor previously granted analytics consent (read
 * from the CookieBanner's localStorage entry before any hit is sent), so
 * returning visitors are tracked without waiting for React to hydrate.
 *
 * The inline init script sends the initial page view; subsequent
 * client-side navigations are tracked via `usePathname`/`useSearchParams`.
 */
export default function GoogleAnalytics({ GA_MEASUREMENT_ID }: { GA_MEASUREMENT_ID: string }) {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	/** Last URL a page view was recorded for (null until first render). */
	const lastTrackedUrl = useRef<string | null>(null);

	useEffect(() => {
		const query = searchParams.toString();
		const url = query ? `${pathname}?${query}` : pathname;

		// The inline init script already records the initial page view, and
		// Strict Mode re-runs effects — only report actual URL changes.
		if (lastTrackedUrl.current === null || lastTrackedUrl.current === url) {
			lastTrackedUrl.current = url;
			return;
		}
		lastTrackedUrl.current = url;

		if (typeof window !== "undefined" && window.gtag) {
			window.gtag("config", GA_MEASUREMENT_ID, {
				page_path: url,
			});
		}
	}, [pathname, searchParams, GA_MEASUREMENT_ID]);

	return (
		<>
			{/* GA4 library script loaded asynchronously after page becomes interactive */}
			<Script
				strategy="afterInteractive"
				src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
			/>

			{/* Initialisation script: sets up dataLayer, consent default (from stored choice), and initial page view */}
			<Script
				id="google-analytics"
				strategy="afterInteractive"
				dangerouslySetInnerHTML={{
					__html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                window.gtag = gtag;

                var analyticsGranted = false;
                try {
                    var stored = JSON.parse(localStorage.getItem(${JSON.stringify(CONSENT_STORAGE_KEY)}) || 'null');
                    analyticsGranted = !!(stored && stored.prefs && stored.prefs.analytics);
                } catch (e) {}

                gtag('consent', 'default', {
                    'analytics_storage': analyticsGranted ? 'granted' : 'denied'
                });

                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}', {
                    page_path: window.location.pathname + window.location.search,
                });
                `,
				}}
			/>
		</>
	);
}
