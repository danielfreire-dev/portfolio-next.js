/* "use client";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { ReactNode } from "react";

// Validate environment variables
const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const posthogHost =
	process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com";

if (typeof window !== "undefined" && posthogKey) {
	posthog.init(posthogKey, {
		opt_out_capturing_by_default: true,
		api_host: posthogHost,
		capture_pageview: "history_change",
		capture_pageleave: "if_capture_pageview",
		disable_session_recording: true,
		persistence: "localStorage",
		loaded: (posthog) => {
			if (process.env.NODE_ENV === "production") posthog.debug();
		},
	});
} else if (typeof window !== "undefined") {
	console.warn("PostHog API key is missing. Analytics will be disabled.");
}

interface PHProviderProps {
	children: ReactNode;
}

export function PostHogProviderComponent({
	children,
}: {
	children: React.ReactNode;
}) {
	// Only provide PostHog if it was properly initialized
	if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
		return <>{children}</>;
	}

	return <PHProvider client={posthog}>{children}</PHProvider>;
}
 */
