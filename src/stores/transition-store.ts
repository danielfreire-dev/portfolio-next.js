import { create } from "zustand";

interface TransitionState {
	/** Whether a page-transition fade animation is in progress. */
	isTransitioning: boolean;
	/** Begin the page-transition animation (adds the CSS class). */
	startTransition: () => void;
	/** End the page-transition animation (removes the CSS class). */
	endTransition: () => void;
}

/**
 * Manages the `page-transition` CSS class on `#main` via React state so it
 * survives React reconciliation during client-side navigation.
 *
 * Direct DOM manipulation (`classList.add`) is overwritten by React when the
 * layout re-renders on route change, making CSS transitions invisible.
 */
export const useTransitionStore = create<TransitionState>((set) => ({
	isTransitioning: false,
	startTransition: () => set({ isTransitioning: true }),
	endTransition: () => set({ isTransitioning: false }),
}));
