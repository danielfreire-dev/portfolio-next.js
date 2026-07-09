"use client";

import React, { ComponentProps, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
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
 * Sleeps for the given number of milliseconds.
 * Used to delay navigation so the page-transition CSS animation can play.
 */
function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * TransitionLink - A navigation link with a page-transition animation.
 *
 * On click, the component adds a `page-transition` CSS class to `<main>`,
 * waits 333 ms for the CSS fade-out animation to complete, then navigates
 * via `router.push()`. This delay is the minimum needed for the CSS
 * transition to be perceptible while keeping navigation feeling responsive.
 *
 * On route change (pathname update), the transition class is removed and
 * the mobile sidenav is closed if it was open. Same-page clicks (where the
 * target path matches the current path) are ignored to avoid unnecessary
 * animation cycles.
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

	useEffect(() => {
		const mainElement = document.getElementById("main");
		if (setIsOpen && isOpen) {
			setIsOpen((prev) => !prev);
		}
		mainElement?.classList.remove("page-transition");
	}, [pathname]);

	const HandleTransition = async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
		e.preventDefault();
		const mainElement = document.getElementById("main");

		if ((href === "/" && pathname.slice(0, -2) !== href) || (href !== "/" && pathname.slice(3) !== href)) {
			mainElement?.classList.add("page-transition");

			await sleep(333);

			router.push(href as string);
		}
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
