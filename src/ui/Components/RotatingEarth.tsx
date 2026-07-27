"use client";
import React, { useRef, useEffect, useState } from "react";
import Globe from "react-globe.gl";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Props for the 3D rotating Earth globe component. */
export interface RotatingGlobeProps {
	/** Canvas width in pixels. */
	width?: number;
	/** Canvas height in pixels. */
	height?: number;
	/** Rotation speed multiplier. */
	rotationSpeed?: number;
	/** Whether the globe auto-rotates on mount. */
	autoRotate?: boolean;
	/** Background colour (CSS-compatible). */
	backgroundColor?: string;
	/** URL or path to the globe texture image. */
	globeImageUrl?: string;
	/** URL or path to the bump-map image. */
	bumpImageUrl?: string;
	/** Additional CSS class names. */
	className?: string;
	/** Texture URLs for day/night/specular maps. */
	textures?: {
		day: string;
		night: string;
		specular: string;
	};
	/** Whether to show the night-side pattern. */
	showNightPattern?: boolean;
	/** Whether to animate the globe entrance. */
	animateIn?: boolean;
}

/** 3D rotation vector. */
export interface GlobeRotation {
	x: number;
	y: number;
	z: number;
}

/**
 * 3D rotating Earth globe visualisation.
 *
 * Uses `react-globe.gl` to render an interactive, rotatable Earth with
 * auto-rotation powered by GSAP animation loops and optional scroll-driven
 * parallax effects. Generates random arc data on render to create dynamic
 * flight-path-style overlays that give the globe a live, data-rich feel.
 *
 * Globe initialisation is gated on the `globeReady` state, set by the
 * `onGlobeReady` callback, to prevent GSAP from targeting a null ref.
 * Rotation can be toggled via `toggleRotation` and reset via `resetRotation`
 * (both are currently wired to commented-out UI buttons).
 *
 * @todo Expose `toggleRotation` and `resetRotation` through visible controls
 *       so users can pause or restart the auto-rotation.
 */
const RotatingEarth: React.FC<RotatingGlobeProps> = ({
	width = 600,
	height = 600,
	rotationSpeed = 1.2,
	autoRotate = true,
	backgroundColor = "rgba(0,0,0,0)",
	globeImageUrl = "images/globes/earth-blue-marble.jpg",
	bumpImageUrl = "images/globes/earth-topology.png",
	className = "",
	animateIn = true,
}) => {
	const globeRef = useRef<any>();
	const containerRef = useRef<HTMLDivElement>(null);

	const [isRotating, setIsRotating] = useState(autoRotate);
	const [globeReady, setGlobeReady] = useState(false);

	useGSAP(() => {
		if (!globeRef.current || !isRotating) return;

		const rotation = { y: 0 };

		gsap.to(rotation, {
			y: 360,
			duration: 100 / rotationSpeed,
			repeat: -1,
			ease: "linear",
			onUpdate: () => {
				if (globeRef.current) {
					globeRef.current.controls().autoRotate = true;
					globeRef.current.controls().autoRotateSpeed = rotationSpeed;
				}
			},
		});

		return () => {
			if (globeRef.current) {
				globeRef.current.controls().autoRotate = false;
			}
		};
	}, [isRotating, rotationSpeed, globeReady]);

	useGSAP(() => {
		if (!containerRef.current) return;

		gsap.to(containerRef.current, {
			scrollTrigger: {
				trigger: containerRef.current,
				start: "top center",
				end: "bottom top",
				scrub: true,
			},
			rotation: 10,
			ease: "sine.inOut",
		});
	}, []);

	const handleGlobeReady = () => {
		setGlobeReady(true);
		if (globeRef.current) {
			globeRef.current.controls().autoRotate = isRotating;
			globeRef.current.controls().autoRotateSpeed = rotationSpeed;
			globeRef.current.controls().enableZoom = false;
		}
	};

	const toggleRotation = () => {
		setIsRotating(!isRotating);
	};

	const resetRotation = () => {
		if (globeRef.current) {
			globeRef.current.controls().autoRotate = false;
			globeRef.current.controls().reset();
			setIsRotating(false);

			setTimeout(() => {
				setIsRotating(autoRotate);
			}, 1000);
		}
	};

	const N = 20;
	const arcsData = [...Array(N).keys()].map(() => ({
		startLat: (Math.random() - 0.5) * 180,
		startLng: (Math.random() - 0.5) * 360,
		endLat: (Math.random() - 0.5) * 180,
		endLng: (Math.random() - 0.5) * 360,
		color: [
			["red", "white", "blue", "green"][Math.round(Math.random() * 3)],
			["red", "white", "blue", "green"][Math.round(Math.random() * 3)],
		],
	}));

	return (
		<div
			ref={containerRef}
			className={`relative ${className}`}>
			<div className="relative w-full cursor-grab">
				<Globe
					ref={globeRef}
					width={width}
					height={height}
					bumpImageUrl={bumpImageUrl}
					globeImageUrl={globeImageUrl}
					backgroundColor={backgroundColor}
					onGlobeReady={handleGlobeReady}
					animateIn
					showAtmosphere
					atmosphereColor="lightskyblue"
					atmosphereAltitude={0}
					showGraticules={false}
					enablePointerInteraction
					arcsData={arcsData}
					arcColor="color"
					arcDashLength={() => Math.random()}
					arcDashGap={() => Math.random()}
					arcDashAnimateTime={() => Math.random() * 4000 + 1000}
				/>
			</div>

			{!globeReady && (
				<div className="absolute inset-0 flex items-center justify-center bg-transparent">
					<div
						className="text-(--text)"
						role="status"
						aria-live="polite">
						Loading...
					</div>
				</div>
			)}
		</div>
	);
};

export default RotatingEarth;
