/* // NOTE: This is how you can include the external dependencies so they are in your bundle and not loaded async at runtime
// import 'posthog-js/dist/recorder'
// import 'posthog-js/dist/surveys'
// import 'posthog-js/dist/exception-autocapture'
// import 'posthog-js/dist/tracing-headers'

import posthogJS, { PostHog, PostHogConfig } from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";

export const PERSON_PROCESSING_MODE: "always" | "identified_only" | "never" =
	(process.env.NEXT_PUBLIC_POSTHOG_PERSON_PROCESSING_MODE as any) ||
	"identified_only";

export const POSTHOG_USE_SNIPPET: boolean =
	(process.env.NEXT_PUBLIC_POSTHOG_USE_SNIPPET as any) || false;

export const posthog: PostHog = POSTHOG_USE_SNIPPET
	? typeof window !== "undefined"
		? (window as any).posthog
		: null
	: posthogJS;

// we use undefined for SSR to indicated that we haven't check yet (as the state lives in cookies)
export type ConsentState = "granted" | "denied" | "pending" | undefined;



export function cookieConsentGiven(): ConsentState {
	if (typeof window === "undefined") return undefined;
	return (posthog as any).get_explicit_consent_status;
}

export const configForConsent = (): Partial<PostHogConfig> => {
	const consentGiven = cookieConsentGiven();

	return {
		disable_surveys: consentGiven !== "granted",
		autocapture: consentGiven === "granted",
		disable_session_recording: consentGiven !== "granted",
	};
};

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

if (typeof window !== "undefined") {
	posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY || "", {
		api_host:
			process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com",
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
		person_profiles:
			PERSON_PROCESSING_MODE === "never"
				? "identified_only"
				: PERSON_PROCESSING_MODE,
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
	// Help with debugging
	(window as any).posthog = posthog;
}

export function NextHogProvider({ children }: { children: React.ReactNode }) {
	return <PHProvider client={posthog}>{children}</PHProvider>;
}
 */
