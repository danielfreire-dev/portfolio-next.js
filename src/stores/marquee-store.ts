import { create } from "zustand";

/** Shared pause state for every {@link Marquee} on the page. */
export type MarqueeStore = {
	/** Whether all marquees are paused. */
	paused: boolean;
	/** Pauses or resumes all marquees. */
	togglePaused: () => void;
};

/**
 * Global marquee pause store.
 *
 * Any marquee's pause button toggles this one flag, so a single click pauses
 * (or resumes) every marquee, and all pause buttons show the same state.
 * Kept in memory only: a full reload starts the animation again.
 */
export const useMarqueeStore = create<MarqueeStore>((set) => ({
	paused: false,
	togglePaused: () => set((state) => ({ paused: !state.paused })),
}));
