"use client";
import { CldImage } from "next-cloudinary";

/** Props for the Cloudinary image wrapper component. */
interface CloudinaryImgProps {
	/** Public ID or URL of the Cloudinary image. */
	src: string;
	/** Alt text for accessibility. */
	alt?: string;
	/** Display width in pixels. */
	width?: number;
	/** Display height in pixels. */
	height?: number;
	/** Additional CSS class names. */
	className?: string;
	/** Loading strategy: lazy (default) or eager. */
	loading?: "lazy" | "eager";
}

/**
 * Cloudinary-optimised image component.
 *
 * Wraps `next-cloudinary`'s `CldImage` with sensible defaults. Auto-format
 * and auto-quality are applied by the underlying component for optimised
 * delivery.
 */
const CloudinaryImg = ({
	src,
	alt = "Cloudinary image",
	width = 500,
	height = 500,
	className = "",
	loading = "lazy",
}: CloudinaryImgProps) => {
	return (
		<CldImage
			src={src}
			width={width}
			height={height}
			alt={alt}
			className={className}
			loading={loading}
			crop={{
				type: "auto",
				source: true,
			}}
		/>
	);
};
export default CloudinaryImg;
