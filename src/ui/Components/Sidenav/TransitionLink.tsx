"use client";

import React, { ComponentProps, useEffect } from "react";
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
 * 4. **TransitionOverlay detects pathname change** → curtain slides OUT
 *    automatically, revealing the new page.
 * 5. **`useEffect` on `pathname`** → closes the mobile sidenav.
 *
 * No timer (`sleep`) is used — timing is driven by CSS `animationend` events.
 * The reveal is handled by `TransitionOverlay` watching `pathname` directly
 * (it persists in the layout and survives React reconciliation).
 * No Zustand store.  `<main>` stays a server component.
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

	/**
	 * Closes the mobile sidenav when the URL changes after navigation.
	 *
	 * The curtain reveal itself is handled by `TransitionOverlay` watching
	 * `pathname` — that component persists in the layout and survives
	 * React reconciliation, unlike TransitionLink instances which may
	 * unmount during route changes (e.g. dynamic routes like `/services/[slug]`).
	 */
	useEffect(() => {
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
