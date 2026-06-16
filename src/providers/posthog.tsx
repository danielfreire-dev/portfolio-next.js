/* // NOTE: This is how you can include the external dependencies so they are in your bundle and not loaded async at runtime
// import 'posthog-js/dist/recorder'
// import 'posthog-js/dist/surveys'
// import 'posthog-js/dist/exception-autocapture'
// import 'posthog-js/dist/tracing-headers'

import posthogJS, { PostHog, PostHogConfig } from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";

/** Person-processing mode for PostHog: always, identified_only, or never. */
export const PERSON_PROCESSING_MODE: "always" | "identified_only" | "never" =
	(process.env.NEXT_PUBLIC_POSTHOG_PERSON_PROCESSING_MODE as any) || "identified_only";

/** Whether to use the PostHog snippet loader instead of the NPM package. */
export const POSTHOG_USE_SNIPPET: boolean = (process.env.NEXT_PUBLIC_POSTHOG_USE_SNIPPET as any) || false;

/**
 * Shared PostHog instance.
 * Uses the snippet-based client if configured, otherwise the NPM package.
 */
export const posthog: PostHog =
	POSTHOG_USE_SNIPPET ?
		typeof window !== "undefined" ?
			(window as any).posthog
		:	null
	:	posthogJS;

/**
 * Consent state type.
 * `undefined` is used during SSR to indicate the check hasn't run yet.
 */
export type ConsentState = "granted" | "denied" | "pending" | undefined;

/** Reads the current explicit-consent status from the PostHog instance. */
export function cookieConsentGiven(): ConsentState {
	if (typeof window === "undefined") return undefined;
	return (posthog as any).get_explicit_consent_status;
}

/** Builds a PostHog config object that respects the current consent state. */
export const configForConsent = (): Partial<PostHogConfig> => {
	const consentGiven = cookieConsentGiven();

	return {
		disable_surveys: consentGiven !== "granted",
		autocapture: consentGiven === "granted",
		disable_session_recording: consentGiven !== "granted",
	};
};

/** Updates PostHog's opt-in/out state and re-applies the consent-aware config. */
export const updatePostHogConsent = (consentGiven: ConsentState) => {
	if (consentGiven !== undefined) {
		if (consentGiven === "granted") {
			posthog.opt_in_capturing();
		} else if (consentGiven === "denied") {
			posthog.opt_out_capturing();
		} else if (consentGiven === "pending") {
			posthog.clear_opt_in_out_capturing();
			posthog.reset();
		}
	}

	posthog.set_config(configForConsent());
};

// Initialise PostHog on the client side
if (typeof window !== "undefined") {
	posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY || "", {
		api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com",
		session_recording: {
			recordCrossOriginIframes: false,
			blockSelector: ".ph-block-image",
			ignoreClass: "ph-ignore-image",
		},
		debug: true,
		capture_pageview: "history_change",
		disable_web_experiments: true,
		scroll_root_selector: ["#scroll_element", "html"],
		persistence: "localStorage+cookie",
		person_profiles: PERSON_PROCESSING_MODE === "never" ? "identified_only" : PERSON_PROCESSING_MODE,
		persistence_name: `${process.env.NEXT_PUBLIC_POSTHOG_KEY}_nextjs`,
		opt_in_site_apps: true,
		integrations: {
			intercom: true,
			crispChat: true,
		},
		__preview_remote_config: true,
		cookieless_mode: undefined,
		__preview_flags_v2: true,
		...configForConsent(),
	});
	// Expose PostHog globally for debugging
	(window as any).posthog = posthog;
}

/**
 * PostHog provider component.
 * Wraps children with the PostHog React context provider.
 * /
export function NextHogProvider({ children }: { children: React.ReactNode }) {
	return <PHProvider client={posthog}>{children}</PHProvider>;
}
 */
