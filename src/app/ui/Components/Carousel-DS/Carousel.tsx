// components/Carousel.tsx
"use client";
import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { CarouselProps } from "../../types";
import { nanoid } from "nanoid";

export default function Carousel({ slides }: CarouselProps) {
	const [currentIndex, setCurrentIndex] = useState(0);

	const goToNext = useCallback(() => {
		setCurrentIndex((prevIndex) =>
			prevIndex === slides.length - 1 ? 0 : prevIndex + 1,
		);
	}, [slides.length]);

	const goToPrev = useCallback(() => {
		setCurrentIndex((prevIndex) =>
			prevIndex === 0 ? slides.length - 1 : prevIndex - 1,
		);
	}, [slides.length]);

	const goToSlide = (index: number) => {
		setCurrentIndex(index);
	};

	// Auto-advance every 5 seconds
	useEffect(() => {
		const interval = setInterval(goToNext, 5000);
		return () => clearInterval(interval);
	}, [goToNext]);

	return (
		<div className="relative w-full h-[500px] overflow-hidden rounded-xl">
			<div
				className="flex transition-transform duration-500 ease-in-out"
				style={{ transform: `translateX(-${currentIndex * 100}%)` }}
			>
				{slides.map((carousel) => (
					<div key={nanoid()} className="relative w-full flex-shrink-0">
						<div className="absolute inset-0 bg-black/30 z-10" />
						<Image
							src={carousel.carouselImg}
							alt={carousel.carouselAlt}
							height={1000}
							width={1000}
							className="object-cover"
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
							priority
						/>

						{/* Centered message overlay */}
						<div className="absolute inset-0 flex items-center justify-center z-20 px-4">
							<h2 className="text-white text-3xl md:text-5xl font-bold text-center max-w-3xl">
								{carousel.carouselTxt}
							</h2>
						</div>

						{/* Dots navigation */}
						<div className="absolute bottom-4 right-4 flex gap-2 z-20">
							{slides.map((_, index) => (
								<button
									key={index}
									onClick={() => goToSlide(index)}
									className={`w-3 h-3 rounded-full transition-all ${
										currentIndex === index
											? "bg-white scale-125"
											: "bg-white/50 hover:bg-white/80"
									}`}
									aria-label={`Go to slide ${index + 1}`}
								/>
							))}
						</div>
					</div>
				))}
			</div>

			{/* Navigation arrows */}
			<button
				onClick={goToPrev}
				className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all"
				aria-label="Previous slide"
			>
				<ChevronLeftIcon />
			</button>
			<button
				onClick={goToNext}
				className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all"
				aria-label="Next slide"
			>
				<ChevronRightIcon />
			</button>
		</div>
	);
}

// Icons for arrows
function ChevronLeftIcon() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className="h-6 w-6"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M15 19l-7-7 7-7"
			/>
		</svg>
	);
}

function ChevronRightIcon() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className="h-6 w-6"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M9 5l7 7-7 7"
			/>
		</svg>
	);
}
