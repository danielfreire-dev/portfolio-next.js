/**
 * Mock factories for third-party components used throughout the app.
 *
 * Each mock renders a lightweight stub (usually a `<div>` with a data-testid)
 * so component tests can focus on business logic rather than widget internals.
 */

import React from "react";
import { vi } from "vitest";

// ---- next-cloudinary (CldImage) ----

export const MockCldImage = (props: Record<string, unknown>) =>
	React.createElement("img", {
		"data-testid": "cld-image",
		alt: (props.alt as string) || "",
		src: (props.src as string) || "",
		...Object.fromEntries(Object.entries(props).filter(([k]) => k !== "alt" && k !== "src")),
	});

// ---- next-turnstile (Turnstile widget) ----

export const MockTurnstile = (props: Record<string, unknown>) =>
	React.createElement("div", {
		"data-testid": "turnstile-widget",
		...props,
	});

// ---- @vercel/speed-insights (SpeedInsights) ----

export const MockSpeedInsights = () => React.createElement("div", { "data-testid": "speed-insights" });

// ---- gsap / @gsap/react ----

export const mockGsap = {
	to: () => ({}),
	from: () => ({}),
	fromTo: () => ({}),
	set: () => ({}),
	timeline: () => ({
		to: () => ({}),
		from: () => ({}),
		fromTo: () => ({}),
	}),
	registerPlugin: () => {},
	matchMedia: () => ({}),
};

// ---- motion (Framer Motion replacement) ----

export const MockMotionDiv = ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) =>
	React.createElement("div", { "data-testid": "motion-div", ...props }, children);

// ---- resend (email client) ----

export const mockResend = {
	emails: {
		send: async () => ({ data: { id: "test-email-id" }, error: null }),
	},
};

export const MockResend = vi.fn(() => mockResend);
