"use client";

import { useTransitionStore } from "@/stores/transition-store";
import Cta from "@/ui/Components/CtA/Cta";

/**
 * Client-side wrapper for the main content area.
 *
 * Reads the `isTransitioning` flag from the transition store and applies the
 * `page-transition` CSS class via React state so it survives reconciliation
 * during client-side navigations (unlike direct `classList.add` manipulation).
 */
export function MainContent({ children }: { children: React.ReactNode }) {
	const isTransitioning = useTransitionStore((s) => s.isTransitioning);

	return (
		<main className="flex flex-1 justify-center flex-col overflow-hidden pb-5 mt-9">
			<div
				id="main"
				className={`flex flex-col gap-4${isTransitioning ? " page-transition" : ""}`}>
				{children}
				<Cta />
			</div>
		</main>
	);
}
