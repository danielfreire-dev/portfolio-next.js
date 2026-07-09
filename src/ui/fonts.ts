import { Kolker_Brush, Lusitana, Montserrat } from "next/font/google";

/**
 * Decorative brush-script font used for accent headings.
 *
 * Kolker Brush provides a hand-drawn aesthetic that adds visual interest
 * to section headings and callout text. Loaded with Latin and Latin Extended
 * subsets to support all locale character sets used in the application.
 */
export const kolker = Kolker_Brush({
	subsets: ["latin", "latin-ext"],
	weight: ["400"],
});

/**
 * Serif font used for body text and headings.
 *
 * Lusitana is a classic serif typeface optimised for on-screen readability.
 * Regular (400) and bold (700) weights are loaded to cover all typographic
 * hierarchy needs across the portfolio's content pages.
 */
export const lusitana = Lusitana({
	subsets: ["latin"],
	weight: ["400", "700"],
});

/**
 * Sans-serif font used for UI elements and general text.
 *
 * Montserrat provides clean, geometric sans-serif rendering for navigation,
 * buttons, form labels and other interactive elements where clarity at small
 * sizes is critical. Regular weight only is loaded to minimise bundle size.
 */
export const montserrat = Montserrat({
	subsets: ["latin", "latin-ext"],
	weight: ["400"],
});
