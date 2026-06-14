import { Kolker_Brush, Lusitana, Montserrat } from "next/font/google";

/** Decorative brush-script font used for accent headings. */
export const kolker = Kolker_Brush({
  subsets: ["latin", "latin-ext"],
  weight: ["400"],
});

/** Serif font used for body text and headings. */
export const lusitana = Lusitana({
  subsets: ["latin"],
  weight: ["400", "700"],
});

/** Sans-serif font used for UI elements and general text. */
export const montserrat = Montserrat({
  subsets: ["latin", "latin-ext"],
  weight: ["400"],
});
