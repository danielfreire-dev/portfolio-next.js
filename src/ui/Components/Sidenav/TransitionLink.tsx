"use client";

import React, { ComponentProps, useEffect, useRef } from "react";
import { useRouter, usePathname } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";

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
 * TransitionLink — A navigation link with a page-transition animation.
 *
 * ## Curtain transition flow (event-driven, no timer, no store)
 *
 * 1. **Click** → dispatches `transition:start` so the overlay slides IN
 *    (covering the old `<main>` content).
 * 2. **Wait for `transition:covered`** → the overlay has finished sliding in;
 *    it's safe to navigate underneath the curtain.
 * 3. **`router.push()`** → URL changes, React renders the new page behind
 *    the overlay.
 * 4. **`useEffect` on `pathname`** → dispatches `transition:reveal` so the
 *    overlay slides OUT, revealing the new page.  Also closes the mobile
 *    sidenav.
 *
 * No timer (`sleep`) is used — timing is driven by CSS `animationend` events.
 * No Zustand store.  `<main>` stays a server component.  Only the thin
 * `TransitionOverlay` is client-side.
 *
 * Same-page clicks are ignored to avoid unnecessary animation cycles.
 */
export const TransitionLink = ({
	children,
	href,
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

	/** Tracks whether *this* link instance initiated the current transition. */
	const triggeredByUs = useRef(false);

	/**
	 * Listens for URL changes.
	 *
	 * When the pathname updates after a navigation triggered by this link,
	 * dispatches `transition:reveal` so the overlay slides out and closes the
	 * mobile sidenav.
	 */
	useEffect(() => {
		if (!triggeredByUs.current) return;
		triggeredByUs.current = false;

		// Reveal the new page behind the overlay.
		document.dispatchEvent(new CustomEvent("transition:reveal"));

		if (setIsOpen && isOpen) {
			setIsOpen((prev) => !prev);
		}
	}, [pathname, isOpen, setIsOpen]);

	const HandleTransition = async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
		e.preventDefault();

		// Both `usePathname()` from next-intl and `href` from the Link
		// component use the same unprefixed pathname keys (e.g. "/portfolio"),
		// so a direct comparison is correct without locale wrangling.
		const hrefPath = typeof href === "string" ? href : href.pathname;

		if (pathname !== hrefPath) {
			// 1. Start the curtain sliding in.
			document.dispatchEvent(new CustomEvent("transition:start"));

			// 2. Wait for the curtain to fully cover the old content.
			await new Promise<void>((resolve) => {
				const onCovered = () => {
					document.removeEventListener("transition:covered", onCovered);
					resolve();
				};
				document.addEventListener("transition:covered", onCovered);
			});

			// 3. Navigate while the page is hidden behind the overlay.
			triggeredByUs.current = true;
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
