"use client";
import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import {
	NextButton,
	PrevButton,
	usePrevNextButtons,
} from "./EmblaCarouselArrowButtons";
import { PropType } from "@/app/ui/types";
import Image from "next/image";

const switchIndex = (index: number, currentSlide: number): React.ReactNode => {
	const commonClasses =
		"carousel-img permanent-transitions ease-in-out duration-500";
	const activeClasses = "active-carousel";
	const inactiveClasses = "blur-xs grayscale-69";

	switch (index + 1) {
		case 1:
			return (
				<Image
					src={"/images/building-orange.webp"}
					className={`${commonClasses} ${
						index === currentSlide ? activeClasses : inactiveClasses
					}`}
					alt="orange building"
					width={1000}
					height={1000}
				/>
			);

			break;
		case 2:
			return (
				<Image
					src="/images/building-yellow.webp"
					className={`${commonClasses} ${
						index === currentSlide ? activeClasses : inactiveClasses
					}`}
					alt="yellow building"
					width={1000}
					height={1000}
				/>
			);

			break;
		case 3:
			return (
				<Image
					src="/images/pencils.webp"
					className={`${commonClasses} ${
						index === currentSlide ? activeClasses : inactiveClasses
					}`}
					alt="pencils"
					width={1000}
					height={1000}
				/>
			);

		default:
			return null;
			break;
	}
};

const EmblaCarousel: React.FC<PropType> = (props) => {
	const { slides, options } = props;
	const [emblaRef, emblaApi] = useEmblaCarousel(options, [
		AutoScroll({ playOnInit: false }),
	]);
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentSlide, setCurrentSlide] = useState(0);

	const {
		prevBtnDisabled,
		nextBtnDisabled,
		onPrevButtonClick,
		onNextButtonClick,
	} = usePrevNextButtons(emblaApi);

	const onButtonAutoplayClick = useCallback(
		(callback: () => void) => {
			const autoScroll = emblaApi?.plugins()?.autoScroll;
			if (!autoScroll) return;

			const resetOrStop =
				autoScroll.options.stopOnInteraction === false
					? autoScroll.reset
					: autoScroll.stop;

			resetOrStop();
			callback();
		},
		[emblaApi],
	);

	const toggleAutoplay = useCallback(() => {
		const autoScroll = emblaApi?.plugins()?.autoScroll;
		if (!autoScroll) return;

		const playOrStop = autoScroll.isPlaying()
			? autoScroll.stop
			: autoScroll.play;
		playOrStop();
	}, [emblaApi]);

	useEffect(() => {
		const autoScroll = emblaApi?.plugins()?.autoScroll;
		if (!autoScroll) return;

		setIsPlaying(autoScroll.isPlaying());
		emblaApi
			.on("autoScroll:play", () => setIsPlaying(true))
			.on("autoScroll:stop", () => setIsPlaying(false))
			.on("reInit", () => setIsPlaying(autoScroll.isPlaying()));
	}, [emblaApi]);

	return (
		<div className="embla">
			<div className="embla__viewport" ref={emblaRef}>
				<div className="embla__container">
					{slides.map((index) => (
						<div className="embla__slide" key={index}>
							<div className={`embla__slide__number slide${index + 1} w-96`}>
								{switchIndex(index, currentSlide)}
							</div>
						</div>
					))}
				</div>
			</div>

			<div className="embla__controls">
				<div className="embla__buttons">
					<PrevButton
						onClick={() => onButtonAutoplayClick(onPrevButtonClick)}
						disabled={prevBtnDisabled}
					/>
					<NextButton
						onClick={() => onButtonAutoplayClick(onNextButtonClick)}
						disabled={nextBtnDisabled}
					/>
				</div>

				<button className="embla__play" onClick={toggleAutoplay} type="button">
					{isPlaying ? "Stop" : "Start"}
				</button>
			</div>
		</div>
	);
};

export default EmblaCarousel;
