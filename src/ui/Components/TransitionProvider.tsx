"use client";

import { usePathname } from "@/i18n/navigation";
import { TransitionOverlay } from "./TransitionOverlay";
import { ReactNode } from "react";

/**
 * TransitionProvider — Client component wrapper that ensures TransitionOverlay
 * re-renders on pathname changes during client-side navigation.
 *
 * In Next.js App Router, server component layouts don't re-render during
 * client-side navigation. By moving TransitionOverlay into a client component
 * that wraps the page content, we ensure it properly detects pathname changes
 * and triggers the uncovering animation.
 */
interface TransitionProviderProps {
	children: ReactNode;
}

export function TransitionProvider({ children }: TransitionProviderProps) {
	// This hook forces the component to re-render when pathname changes
	usePathname();

	return (
		<>
			<TransitionOverlay />
			{children}
		</>
	);
}
