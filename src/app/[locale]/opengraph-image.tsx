import { getTranslations } from "next-intl/server";
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Image metadata
export const alt = "Daniel Freire | Portfolio";
export const size = {
	width: 1200,
	height: 630,
};
export const contentType = "image/png";

// Image generation
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
					width: "auto",
					height: "auto",
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
