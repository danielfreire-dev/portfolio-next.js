"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import "../../styles/carousel.css";

interface SliderItem {
	imageUrl: string;
	alt: string;
	title: string;
	description: string;
}

interface SliderProps {
	items: SliderItem[];
	icons: {
		leftarrow: { src: string; alt: string };
		rightarrow: { src: string; alt: string };
	};
}

export default function Slider({ items, icons }: SliderProps) {
	const [slideOrder, setSlideOrder] = useState<number[]>(
		Array.from({ length: items.length }, (_, i) => i),
	);
	const [isPaused, setIsPaused] = useState(false);
	const [itemVersions, setItemVersions] = useState<Record<string, number>>({});

	const goNext = useCallback(() => {
		setSlideOrder((prev) => {
			const firstItemIndex = prev[0];
			const firstItem = items[firstItemIndex];

			// Update version for moved item
			setItemVersions((prevVersions) => ({
				...prevVersions,
				[firstItem.imageUrl]: (prevVersions[firstItem.imageUrl] || 0) + 1,
			}));

			return [...prev.slice(1), firstItemIndex];
		});
	}, [items]);

	const goPrev = useCallback(() => {
		setSlideOrder((prev) => {
			const lastItemIndex = prev[prev.length - 1];
			const lastItem = items[lastItemIndex];

			// Update version for moved item
			setItemVersions((prevVersions) => ({
				...prevVersions,
				[lastItem.imageUrl]: (prevVersions[lastItem.imageUrl] || 0) + 1,
			}));

			return [lastItemIndex, ...prev.slice(0, -1)];
		});
	}, [items]);

	useEffect(() => {
		if (isPaused) return;
		const timer = setInterval(goNext, 4000);
		return () => clearInterval(timer);
	}, [goNext, isPaused]);

	return (
		<main
			className="slider-container"
			onMouseEnter={() => setIsPaused(true)}
			onMouseLeave={() => setIsPaused(false)}
		>
			<ul className="slider">
				{slideOrder.map((itemIndex) => {
					const item = items[itemIndex];
					// Create unique key with version number
					const uniqueKey = `${item.imageUrl}-${
						itemVersions[item.imageUrl] || 0
					}`;

					return (
						<li className="item" key={uniqueKey}>
							<Image
								src={item.imageUrl}
								alt={item.alt}
								fill
								quality={100}
								placeholder="blur"
								blurDataURL={item.imageUrl}
								objectPosition="center"
								style={{
									objectFit: "cover", // cover, contain, none
								}}
							/>
							<div className="content">
								<h2>{item.title}</h2>
								<p>{item.description}</p>
								<button>Read More</button>
							</div>
						</li>
					);
				})}
			</ul>

			<div className="nav">
				<button onClick={goPrev} className="btn prev">
					<Image
						src={icons.leftarrow.src}
						alt={icons.leftarrow.alt}
						width={24}
						height={24}
					/>
				</button>
				<button onClick={goNext} className="btn next">
					<Image
						src={icons.rightarrow.src}
						alt={icons.rightarrow.alt}
						width={24}
						height={24}
					/>
				</button>
			</div>
		</main>
	);
}
