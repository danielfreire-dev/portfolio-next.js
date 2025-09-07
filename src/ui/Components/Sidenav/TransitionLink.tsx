"use client";

import React, { ComponentProps, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Link } from "@/i18n/navigation";
import posthog from "posthog-js";
import { LinkProps } from "next/link";

type onClickCmdProps = "CtA" | "NavLink" | "MobileNavLink" | "Logo";

interface TransitionLinkProps extends ComponentProps<typeof Link> {
	inputData?: onClickCmdProps;
}

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export const TransitionLink = ({
	children,
	href,
	inputData,
	...props
}: TransitionLinkProps) => {
	const router = useRouter();

	const captureButtonClick = (message: string) => {
		posthog.capture(message, {
			cool: true,
		});
	};

	switch (inputData) {
		case "CtA":
			captureButtonClick("CtAButton_clicked");
			break;
		case "NavLink":
			captureButtonClick("NavLink_clicked");
			break;
		case "MobileNavLink":
			captureButtonClick("MobileNavLink_clicked");
			break;
		case "Logo":
			captureButtonClick("Logo");
			break;
		default:
			break;
	}

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
