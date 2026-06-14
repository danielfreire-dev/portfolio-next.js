import { getTranslations } from "next-intl/server";
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Image metadata
/** Alt text for the Open Graph image. */
export const alt = "Daniel Freire | Portfolio";
/** Dimensions for the Open Graph image (1200x630, standard OG size). */
export const size = {
	width: 1200,
	height: 630,
};
/** MIME type for the generated image. */
export const contentType = "image/png";

/**
 * Generates the Open Graph image for the portfolio.
 *
 * Renders a styled "DF" initials on a centered layout using the Mozilla Headline
 * font. The image is generated server-side using `next/og` (Satori).
 *
 * @returns An ImageResponse containing the generated OG image.
 */
export default async function Image() {
	// Font loading, process.cwd() is Next.js project directory
	const Headline = await readFile(
		join(
			process.cwd(),
			"../../ui/fonts/Mozilla_Headline/MozillaHeadline-VariableFont_wdth,wght.ttf",
		),
	);

	return new ImageResponse(
		(
			// ImageResponse JSX element
			<div
				style={{
					fontSize: 128,
					background: "var(--background)",
					color: "var(--primary)",
					width: "100dvw",
					height: "100dvh",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				DF
			</div>
		),
		// ImageResponse options
		{
			// For convenience, we can re-use the exported opengraph-image
			// size config to also set the ImageResponse's width and height.
			...size,
			fonts: [
				{
					name: "Mozilla Headline",
					data: Headline,
					style: "normal",
					weight: 400,
				},
			],
		},
	);
}
