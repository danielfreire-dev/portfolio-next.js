"use client";

import { useSelectedLayoutSegment } from "next/navigation";
import { ComponentProps } from "react";
import { Link } from "@/i18n/navigation";
import { TransitionLink } from "./TransitionLink";

/** Props for the NavigationLink component. */
interface NavigationLinkProps extends ComponentProps<typeof Link> {
	/** Whether the sidenav is currently open (for mobile close-on-navigate). */
	isOpen: boolean;
	/** State setter to close the sidenav after navigation. */
	setIsOpen: (value: boolean | ((prevVar: boolean) => boolean)) => void;
}

/**
 * NavigationLink - An active-aware navigation link for the sidenav.
 *
 * Determines if the current route matches the link's `href` using
 * `useSelectedLayoutSegment` and applies an `active` CSS class accordingly.
 * Wraps content in `TransitionLink` for page-transition animations.
 */
const NavigationLink = ({ href, isOpen, setIsOpen, ...rest }: NavigationLinkProps) => {
	const selectedLayoutSegment = useSelectedLayoutSegment();
	const pathname = selectedLayoutSegment ? `/${selectedLayoutSegment}` : "/";
	const isActive = pathname === href || (pathname.startsWith(href.toString()) && href !== "/") ? " active" : "";

	return (
		<TransitionLink
			aria-current={isActive ? "page" : undefined}
			href={href}
			{...rest}
			inputData="NavLink"
			isOpen={isOpen}
			setIsOpen={setIsOpen}
		/>
	);
};

export default NavigationLink;
