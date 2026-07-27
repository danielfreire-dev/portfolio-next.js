/**
 * Client-side instrumentation for PostHog analytics.
 *
 * This file is used by Next.js `instrumentation-client` hook to initialize
 * client-side analytics. The PostHog initialization is currently commented out
 * and can be enabled by uncommenting the code below and setting the required
 * environment variables (`NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST`).
 *
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */
/* import posthog from "posthog-js";

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
	api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
	defaults: "2025-05-24",
});
 */
