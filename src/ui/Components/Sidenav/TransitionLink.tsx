"use client";

import React, { ComponentProps } from "react";
import { useRouter } from "next/navigation";
import { Link } from "@/i18n/navigation";

/* interface TransitionLinkProps extends Link {
	children: React.ReactNode;
	href: string;
} */

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export const TransitionLink = ({
	children,
	href,
	...props
}: ComponentProps<typeof Link>) => {
	const router = useRouter();

	const handleTransition = async (
		e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
	) => {
		e.preventDefault();

		const mainElement = document.getElementById("main");
		mainElement?.classList.add("page-transition");

		await sleep(500);
		router.push(href as string);
		await sleep(500);

		mainElement?.classList.remove("page-transition");
	};

	return (
		<Link {...props} href={href} onClick={handleTransition}>
			{children}
		</Link>
	);
};
