"use client";

import { useSelectedLayoutSegment } from "next/navigation";
import { ComponentProps } from "react";
import { Link } from "@/i18n/navigation";

const NavigationLink = ({ href, ...rest }: ComponentProps<typeof Link>) => {
	const selectedLayoutSegment = useSelectedLayoutSegment();
	const pathname = selectedLayoutSegment ? `/${selectedLayoutSegment}` : "/";
	const isActive =
		pathname === href || (pathname.startsWith(href.toString()) && href !== "/")
			? " active"
			: "";

	return (
		<Link aria-current={isActive ? "page" : undefined} href={href} {...rest} />
	);
};

export default NavigationLink;
