"use client";
import { CldImage } from "next-cloudinary";

interface CloudinaryImgProps {
	src: string;
	alt?: string;
	width?: number;
	height?: number;
	className?: string;
	loading?: "lazy" | "eager";
}
// By default, the CldImage component applies auto-format and auto-quality to all delivery URLs for optimized delivery.
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
			src={src} // Use this sample image or upload your own via the Media Explorer
			width={width} // Transform the image: auto-crop to square aspect_ratio
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
