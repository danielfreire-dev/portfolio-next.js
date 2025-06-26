"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { EmblaOptionsType } from "embla-carousel";
import { DotButton, useDotButton } from "./EmblaCarouselDotButton";
import {
	PrevButton,
	NextButton,
	usePrevNextButtons,
} from "./EmblaCarouselArrowButtons";
import useEmblaCarousel from "embla-carousel-react";
// import "../css/slides.css";

type PropType = {
	slides: number[];
	options?: EmblaOptionsType;
};

const switchIndex = (index: number, currentSlide: number): React.ReactNode => {
	const commonClasses = "permanent-transitions ease-in-out duration-500";
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
	const [emblaRef, emblaApi] = useEmblaCarousel(options);
	const [currentSlide, setCurrentSlide] = useState(0);

	const { selectedIndex, scrollSnaps, onDotButtonClick } =
		useDotButton(emblaApi);

	const {
		prevBtnDisabled,
		nextBtnDisabled,
		onPrevButtonClick,
		onNextButtonClick,
	} = usePrevNextButtons(emblaApi);

	useEffect(() => {
		if (!emblaApi) return;

		const onSelect = () => {
			setCurrentSlide(emblaApi.selectedScrollSnap());
		};

		emblaApi.on("select", onSelect);

		// Cleanup
		return () => {
			emblaApi.off("select", onSelect);
		};
	}, [emblaApi]);

	return (
		<section className="embla z-0">
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
					<PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
					<NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
				</div>

				<div className="embla__dots">
					{scrollSnaps.map((_, index) => (
						<DotButton
							key={index}
							onClick={() => onDotButtonClick(index)}
							className={"embla__dot".concat(
								index === selectedIndex ? " embla__dot--selected" : "",
							)}
						/>
					))}
				</div>
			</div>
		</section>
	);
};

export default EmblaCarousel;
