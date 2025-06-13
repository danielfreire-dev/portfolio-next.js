"use client";
import React from "react";
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

const switchIndex = (index: number): React.ReactNode => {
	switch (index + 1) {
		case 1:
			return (
				<Image
					src={"/images/building-orange.webp"}
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
					alt="pencils"
					width={1000}
					height={1000}
				/>
			);

		default:
			return <p>Hey</p>;
			break;
	}
};

const EmblaCarousel: React.FC<PropType> = (props) => {
	const { slides, options } = props;
	const [emblaRef, emblaApi] = useEmblaCarousel(options);

	const { selectedIndex, scrollSnaps, onDotButtonClick } =
		useDotButton(emblaApi);

	const {
		prevBtnDisabled,
		nextBtnDisabled,
		onPrevButtonClick,
		onNextButtonClick,
	} = usePrevNextButtons(emblaApi);

	return (
		<section className="embla z-0">
			<div className="embla__viewport" ref={emblaRef}>
				<div className="embla__container">
					{slides.map((index) => (
						<div className="embla__slide" key={index}>
							<div className={`embla__slide__number slide${index + 1} w-96`}>
								{switchIndex(index)}
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
