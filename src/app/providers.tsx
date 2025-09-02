"use client";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { ReactNode } from "react";

if (typeof window !== "undefined") {
	posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
		opt_out_capturing_by_default: true,
		api_host:
			process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com",
		// Recommended PostHog configuration options:
		capture_pageview: true, // Auto-capture page views
		capture_pageleave: true, // Capture when users leave the page
		disable_session_recording: true, // Enable session recording
		persistence: "localStorage", // Persist data in localStorage
		loaded: (posthog) => {
			if (process.env.NODE_ENV === "development") posthog.debug();
		},
	});
}

interface PHProviderProps {
	children: ReactNode;
}

export function PostHogProviderComponent({
	children,
}: {
	children: React.ReactNode;
}) {
	return <PHProvider client={posthog}>{children}</PHProvider>;
}
