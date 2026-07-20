"use client";

import React, { ComponentProps, useEffect } from "react";
import { useRouter, usePathname } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { useTransitionStore } from "@/stores/transition-store";

/** Identifies the origin of the click for analytics / transition handling. */
type onClickCmdProps = "CtA" | "NavLink" | "MobileNavLink" | "Logo";

/** Props for the TransitionLink component. */
interface TransitionLinkProps extends ComponentProps<typeof Link> {
	/** Optional identifier for the click origin (analytics / transition type). */
	inputData?: onClickCmdProps;
	/** Whether the mobile sidenav is open (to close it after navigation). */
	isOpen?: boolean;
	/** State setter to close the mobile sidenav after navigation. */
	setIsOpen?: (value: boolean | ((prevVar: boolean) => boolean)) => void;
	/** Accessible label for the link. */
	ariaLabel?: string;
	/** Tooltip text for the link. */
	title?: string;
	/** Additional accessible details for the link. */
	ariaDetails?: string;
}

/**
 * Sleeps for the given number of milliseconds.
 * Used to delay navigation so the page-transition CSS animation can play.
 */
function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * TransitionLink - A navigation link with a page-transition animation.
 *
 * On click, the component signals the transition store to apply the
 * `page-transition` CSS class to `<main>` via React state (not direct DOM
 * manipulation), waits 333 ms for the CSS fade-out animation to start,
 * then navigates via the locale-aware `router.push()`.
 *
 * Because the class is managed through React state, it survives React
 * reconciliation during client-side navigation — the layout component
 * re-renders with `page-transition` still present, so the fade-out
 * animation completes and the new page fades in when the class is removed.
 *
 * On route change (pathname update), the transition class is removed via
 * the store and the mobile sidenav is closed if it was open. Same-page
 * clicks are ignored to avoid unnecessary animation cycles.
 */
export const TransitionLink = ({
	children,
	href,
	inputData,
	isOpen,
	setIsOpen,
	ariaLabel,
	title,
	ariaDetails,
	className,
	...props
}: TransitionLinkProps) => {
	const router = useRouter();
	const pathname = usePathname();
	const startTransition = useTransitionStore((s) => s.startTransition);
	const endTransition = useTransitionStore((s) => s.endTransition);

	useEffect(() => {
		if (setIsOpen && isOpen) {
			setIsOpen((prev) => !prev);
		}
		// Remove the page-transition class via React state (survives reconciliation).
		endTransition();
	}, [pathname]);

	const HandleTransition = async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
		e.preventDefault();

		// Both `usePathname()` from next-intl and `href` from the Link
		// component use the same unprefixed pathname keys (e.g. "/portfolio"),
		// so a direct comparison is correct without locale wrangling.
		const hrefPath = typeof href === "string" ? href : href.pathname;

		if (pathname !== hrefPath) {
			// Apply the page-transition class via React state so it survives
			// reconciliation when the layout re-renders on navigation.
			startTransition();

			await sleep(333);

			// The next-intl router automatically prefixes the href with the
			// current locale, keeping navigation client-side (no full reload).
			router.push(hrefPath as Parameters<typeof router.push>[0]);
		}
		setIsOpen && isOpen && setIsOpen((prev) => !prev);
	};

	return (
		<Link
			{...props}
			href={href}
			onClick={HandleTransition}
			aria-label={ariaLabel}
			title={title}
			aria-details={ariaDetails}
			className={className || "truncate"}>
			{children}
		</Link>
	);
};
