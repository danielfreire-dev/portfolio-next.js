/**
 * Mock helpers for `next-intl` — both client-side hooks and server-side
 * functions.  Use `vi.mock()` with these factories in individual tests
 * or include them via `test-utils.tsx`.
 */

import type { ReactNode } from "react";

// ---- Mock message data ----

/** Minimal English message fixture used by default in test renders. */
export const mockMessages: Record<string, unknown> = {
	metadata: {
		title: { home: "Homepage", about: "About", contact: "Contact", portfolio: "Portfolio", services: "Services" },
		description: {
			home: "A portfolio",
			about: "About me",
			contact: "Get in touch",
			portfolio: "My work",
			services: "Explore services",
		},
		opengraphImageAlt: "Open Graph image",
		canonical: "https://daniel-freire.com",
	},
	home: { techstack: "Tech Stack", trending: "Trending" },
	about: {
		image: "/images/photo.svg",
		paragraph1: "Hello",
		paragraph2: "World",
		paragraph3: "Foo",
		paragraph4: "Bar",
		paragraph5: "Baz",
		paragraph6: "Qux",
		paragraph7: "Quux",
		title1: "Title 1",
		title2: "Title 2",
		title3: "Title 3",
		title4: "Title 4",
		title5: "Title 5",
	},
	contact: {
		btn: "Send",
		email: "E-mail",
		label: "Contact",
		message: "Message",
		firstName: "First Name",
		lastName: "Last Name",
		phone: "Phone",
		privacy: "Privacy",
		title: "Contact Us",
		pageTitle: "Contact Page",
		required: "Required",
		privacyPolicyCheck: "I agree to the",
		privacyPolicyUrl: "/privacy-policy",
		placeholder: {
			email: "you@example.com",
			firstName: "John",
			lastName: "Doe",
			phone: "+351...",
			message: "Your message",
		},
		farewell: { title: "Thank you!", text: "We will be in touch." },
	},
	portfolio: {
		pageTitle: "Portfolio",
		all: "All",
		cta: ["Hire me", "Let's talk"],
		"projects-title": "Projects",
		projects: [] as unknown[],
		"websites-title": "Websites",
		websites: [] as unknown[],
	},
	sidenav: {
		header: { title: "DF", role: "Developer" },
		footer: {
			blurb: "Made by",
			icons: {
				github: { alt: "GitHub", src: "", link: "https://github.com" },
				linkedin: { alt: "LinkedIn", src: "", link: "https://linkedin.com" },
			},
		},
		links: [
			{ name: "Home", link: "/" },
			{ name: "About", link: "/about" },
			{ name: "Portfolio", link: "/portfolio" },
			{ name: "Contact", link: "/contact" },
		],
		privacy: "Privacy Policy",
		rights: "All rights reserved",
	},
	cta: { title: "Interested?", button: ["Yes", "Go"] },
	cookies: {
		title: "Cookies",
		message: "We use cookies",
		buttonText: "Accept",
		declineButtonText: "Decline",
		privacyPolicyText: "Privacy",
		manageButtonText: "Manage",
		manageTitle: "Manage Cookies",
		manageMessage: "Select your preferences",
		manageEssentialTitle: "Essential",
		manageEssentialSubtitle: "Required",
		manageEssentialStatus: "Always active",
		manageEssentialStatusButtonText: "Analytics",
		manageAnalyticsTitle: "Analytics",
		manageAnalyticsSubtitle: "Analytics cookies",
		manageSocialTitle: "Social",
		manageSocialSubtitle: "Social cookies",
		manageAdvertTitle: "Advertising",
		manageAdvertSubtitle: "Ad cookies",
		manageCookiesStatusConsented: "Consented",
		manageCookiesStatusDeclined: "Declined",
		manageCancelButtonText: "Cancel",
		manageSaveButtonText: "Save",
		privacyurl: "/privacy-policy",
	},
	error: {
		errorLoading: {
			title: "Error",
			description: "Something went wrong <retry>Retry</retry>",
		},
	},
	email: {
		email: "contact@daniel-freire.com",
		title: "New Message",
		preview: "You have a new message",
		name: "Daniel Freire",
		heading: "Hello",
		intro: "Thanks for reaching out",
		introduction: "I will get back to you soon",
		happensNext0: "What happens next:",
		happensNext1: "I review your message",
		happensNext2: "I respond within 48h",
		happensNext3: "We discuss your project",
		whileWait0: "While you wait,",
		whileWait1: "Check my portfolio",
		whileWait2: "Read my blog",
		conclusion: "Talk soon!",
		signature: "Best regards,",
		view: "View our",
		privacyPolicy: "Privacy Policy",
		privacyPolicyUrl: "privacy-policy",
		welcome: {} as Record<string, string>,
	},
	carousel: [] as unknown[],
	icons: {
		leftarrow: { alt: "Previous", src: "/icons/chevron-right.svg" },
		rightarrow: { alt: "Next", src: "/icons/chevron-right.svg" },
	},
	tech: [] as unknown[],
	services: [
		{
			slug: "web-development",
			icon: "/images/icons/dns-services.svg",
			iconLarge: "/images/icons/dns-services.svg",
			title: "Web Development",
			text: "Fast, responsive websites.",
			longDescription: "We build modern websites.\n\nThey load fast and work everywhere.",
			features: ["Responsive design", "Core Web Vitals", "PWA support"],
		},
		{
			slug: "ai-solution-implementation",
			icon: "/images/icons/ai-recommend.svg",
			iconLarge: "/images/icons/ai-recommend.svg",
			title: "AI Solution Implementation",
			text: "Integrating AI into workflows.",
			longDescription: "AI applied with purpose.\n\nMeasurable business outcomes.",
			features: ["Chatbots", "Document processing", "Predictive analytics"],
		},
	],
	notFound: {
		title: "Not Found",
		description: "Page not found",
		backHome: "Go home",
	},
};

// ---- Translation helper ----

/** Resolve a dotted key from the mockMessages tree. */
function resolveTranslation(namespace: string | undefined, key: string): string {
	if (!namespace) return key;
	const ns = mockMessages[namespace];
	if (!ns || typeof ns !== "object") return key;
	const keys = key.split(".");
	let current: unknown = ns;
	for (const k of keys) {
		if (typeof current === "object" && current !== null && k in current) {
			current = (current as Record<string, unknown>)[k];
		} else {
			return key;
		}
	}
	if (typeof current === "string") return current;
	return key;
}

/** Process rich text with element interpolation (e.g. "<retry>Retry</retry>"). */
function resolveRichText(raw: string, elements: Record<string, (chunks: ReactNode) => ReactNode>): ReactNode {
	const parts: ReactNode[] = [];
	const regex = /<(\w+)>(.*?)<\/\1>|([^<]+)/g;
	let match: RegExpExecArray | null;
	while ((match = regex.exec(raw)) !== null) {
		if (match[1] && elements[match[1]]) {
			parts.push(elements[match[1]](match[2]));
		} else if (match[3]) {
			parts.push(match[3]);
		}
	}
	return parts.length > 1 ? parts : raw;
}

// ---- Client-side mocks ----

/**
 * Build a mock `useTranslations` compatible with next-intl's API.
 * Returns a `t()` function with an attached `rich()` method.
 */
export function createMockT(namespace?: string) {
	const t = (key: string): string => resolveTranslation(namespace, key);
	t.rich = (key: string, elements: Record<string, (chunks: ReactNode) => ReactNode>): ReactNode => {
		const raw = resolveTranslation(namespace, key);
		return resolveRichText(raw, elements);
	};
	return t;
}

/** Mock factory for `next-intl` client hooks. */
export const mockNextIntlClient = {
	useTranslations: (namespace?: string) => createMockT(namespace),
	useLocale: () => "en" as const,
};

/** Mock factory for `next-intl/server` functions. */
export const mockNextIntlServer = {
	getTranslations: async () => {
		const t = (key: string): string => key;
		t.rich = () => "rich text";
		return t;
	},
	getMessages: async () => mockMessages,
	hasLocale: () => true,
	setRequestLocale: () => {},
};

/** Minimal NextIntlClientProvider — just renders children. */
export function MockNextIntlClientProvider({ children }: { children: ReactNode }) {
	return children as React.ReactElement;
}
