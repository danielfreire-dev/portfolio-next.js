"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

declare global {
  interface Window {
    gtag: any;
  }
}

/**
 * Google Analytics 4 integration component.
 *
 * Injects the GA4 script tag and initialises gtag with consent defaults set
 * to `denied`. Tracks page views on route changes via the `usePathname` and
 * `useSearchParams` hooks.
 */
export default function GoogleAnalytics({
  GA_MEASUREMENT_ID,
}: {
  GA_MEASUREMENT_ID: string;
}) {
  const pathname = usePathname();
  // `useSearchParams` is a client-side hook; safe to call here.
  const searchParams = useSearchParams();

  // Send a page_view event whenever the route changes
  useEffect(() => {
    const url = pathname + searchParams.toString();

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

      {/* Initialisation script: sets up dataLayer, consent default (denied), and initial page view */}
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('consent', 'default', {
                    'analytics_storage': 'denied'
                });

                gtag('config', '${GA_MEASUREMENT_ID}', {
                    page_path: window.location.pathname,
                });
                `,
        }}
      />
    </>
  );
}
