"use client";

import "@/ui/styles/border.css";
import { useTranslations } from "next-intl";
import { TransitionLink } from "../Sidenav/TransitionLink";
import { Suspense, useEffect, useState } from "react";
import { useIsActivePath } from "@/ui/hooks/useIsActivePath";
import { usePathname } from "@/i18n/navigation";

/**
 * Returns a random element from the given array, or `null` if empty.
 *
 * Selects a randomised call-to-action button label from the translation file's
 * `button` array so each page load shows a different CTA phrase. This adds
 * visual variety and avoids banner blindness for returning visitors.
 *
 * @param array - The array of button label strings from the translation data.
 * @returns A random string from the array, or `null` if the array is empty.
 */
const getRandomItem = (array: string[]) => {
	if (array.length === 0) {
		return null;
	}
	const randomIndex = Math.floor(Math.random() * array.length);
	return array[randomIndex];
};

/**
 * Call-to-action button component.
 *
 * Renders a randomised CTA button from a list of translated phrases, linking
 * to the contact page. The server (and the first client render) uses the
 * first `cta.button` label so hydration matches; after mount, and on every
 * route change, a random label is picked so returning users see fresh
 * messaging. Wrapped in Suspense to avoid blocking above-the-fold
 * content while the CTA label resolves.
 *
 * The component hides itself on the contact page (and any child routes) and
 * on 404/not-found pages, preventing redundant CTAs.
 *
 * The link itself is styled as the button (no nested `<button>` inside `<a>`)
 * and its label wraps instead of truncating on narrow screens — see
 * `.cta-button` in `border.css`.
 */
const Cta = () => {
	const t = useTranslations("cta");
	const isActive = useIsActivePath();
	const pathname = usePathname();
	const labels: string[] = t.raw("button");
	const [isNotFound, setIsNotFound] = useState(false);
	// Server render and first client render must match, so start from a
	// deterministic label and only randomise after hydration.
	const [label, setLabel] = useState<string | null>(labels[0] ?? null);

	useEffect(() => {
		setIsNotFound(Boolean(document.querySelector(".not-found-page, [data-testid='not-found-page']")));
		setLabel(getRandomItem(t.raw("button")));
	}, [pathname, t]);

	// Hide on the contact page and its children, or on 404 / not-found pages.
	if (isActive("/contact") || isActive("/404") || isNotFound) {
		return null;
	}

	return (
		<>
			<Suspense>
				<TransitionLink
					href="/contact"
					inputdata="CtA"
					className="button-class offset cta-button self-start">
					{label}
				</TransitionLink>
			</Suspense>
		</>
	);
};

export default Cta;
