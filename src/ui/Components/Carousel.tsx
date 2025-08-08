"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import "@/ui/styles/carousel.css";

import { useTranslations } from "next-intl";
import Link from "next/link";

interface SliderItem {
	alt: string;
	cta: string;
	description: string;
	id: number;
	imageUrl: string;
	title: string;
	url: string;
}

interface SliderProps {
	items: SliderItem[];
}

interface CarouselItemProps {
	alt: string;
	cta: string;
	description: string;
	id: number;
	imageUrl: string;
	title: string;
	url: string;
}

export default function Slider({ items }: SliderProps) {
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

	/* useEffect(() => {
		if (isPaused) return;
		// eslint-disable-next-line no-undef
		const timer = setInterval(goNext, 4000);
		// eslint-disable-next-line no-undef
		return () => clearInterval(timer);
	}, [goNext, isPaused]); */

	const i = useTranslations("icons");

	return (
		<main
			className="slider-container"
			onMouseEnter={() => setIsPaused(true)}
			onMouseLeave={() => setIsPaused(false)}
		>
			<ul className="slider">
				{slideOrder.map((itemIndex) => {
					const itemSlice: CarouselItemProps = items[itemIndex];
					/* Create unique key with version number */
					const uniqueKey = `${itemSlice.imageUrl}-${
						itemVersions[itemSlice.imageUrl] || 0
					}`;

					return (
						<li className="item" key={uniqueKey}>
							<Image
								src={itemSlice.imageUrl}
								alt={itemSlice.alt}
								fill
								quality={100}
								placeholder="blur"
								blurDataURL={itemSlice.imageUrl}
								objectPosition="center"
								style={{
									objectFit: "cover",
								}}
							/>
							<div className="content">
								<h2 className="capitalize">{itemSlice.title}</h2>
								<p>{itemSlice.description}</p>
								<Link href={itemSlice.url} className="size-min">
									<button className="content-btn offset overflow-hidden text-ellipsis whitespace-nowrap hover:cursor-pointer">
										{itemSlice.cta}
									</button>
								</Link>
							</div>
						</li>
					);
				})}
			</ul>

			<div className="nav">
				<button onClick={goPrev} className="btn prev">
					<Image
						src={i("leftarrow.src")}
						alt={i("leftarrow.alt")}
						width={24}
						height={24}
					/>
				</button>
				<button onClick={goNext} className="btn next">
					<Image
						src={i("rightarrow.src")}
						alt={i("rightarrow.alt")}
						width={24}
						height={24}
					/>
				</button>
			</div>
		</main>
	);
}
