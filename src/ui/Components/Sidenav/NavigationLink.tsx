"use client";

import { useSelectedLayoutSegment } from "next/navigation";
import { ComponentProps } from "react";
import { Link } from "@/i18n/navigation";
import { TransitionLink } from "./TransitionLink";

interface NavigationLinkProps extends ComponentProps<typeof Link> {
	isOpen: boolean;
	setIsOpen: (value: boolean | ((prevVar: boolean) => boolean)) => void;
}

const NavigationLink = ({
	href,
	isOpen,
	setIsOpen,
	...rest
}: NavigationLinkProps) => {
	const selectedLayoutSegment = useSelectedLayoutSegment();
	const pathname = selectedLayoutSegment ? `/${selectedLayoutSegment}` : "/";
	const isActive =
		pathname === href || (pathname.startsWith(href.toString()) && href !== "/")
			? " active"
			: "";

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
