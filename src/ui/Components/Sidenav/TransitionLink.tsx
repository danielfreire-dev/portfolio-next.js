"use client";

import React, { ComponentProps, ReactNode, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { set } from "node_modules/cypress/types/lodash";
/* import posthog from "posthog-js"; */

type onClickCmdProps = "CtA" | "NavLink" | "MobileNavLink" | "Logo";

interface TransitionLinkProps extends ComponentProps<typeof Link> {
	inputData?: onClickCmdProps;
	isOpen?: boolean;
	setIsOpen?: (value: boolean | ((prevVar: boolean) => boolean)) => void;
	ariaLabel?: string;
	title?: string;
	ariaDetails?: string;
}

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export const TransitionLink = ({
	children,
	href,
	inputData,
	isOpen,
	setIsOpen,
	ariaLabel,
	title,
	ariaDetails,
	...props
}: TransitionLinkProps) => {
	const router = useRouter();
	const pathname = usePathname();
	const mainElement = document.getElementById("main");
	useEffect(() => {
		if (setIsOpen && isOpen) {
			setIsOpen((prev) => !prev);
		}
		mainElement?.classList.remove("page-transition");
	}, [pathname]);

	const HandleTransition = async (
		e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
	) => {
		e.preventDefault();

		mainElement?.classList.add("page-transition");

		await sleep(500);

		router.push(href as string);
	};

	return (
		<Link
			{...props}
			href={href}
			onClick={HandleTransition}
			aria-label={ariaLabel}
			title={title}
			aria-details={ariaDetails}
			className="truncate"
		>
			{children}
		</Link>
	);
};
