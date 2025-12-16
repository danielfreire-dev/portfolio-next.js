"use client";
import React, { useRef, useEffect, useState } from "react";
import Globe from "react-globe.gl";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
gsap.registerPlugin(useGSAP, ScrollTrigger);

// Type definitions
export interface RotatingGlobeProps {
	width?: number;
	height?: number;
	rotationSpeed?: number;
	autoRotate?: boolean;
	backgroundColor?: string;
	globeImageUrl?: string;
	bumpImageUrl?: string;
	className?: string;
	textures?: {
		day: string;
		night: string;
		specular: string;
	};
	showNightPattern?: boolean;
	animateIn?: boolean;
}

export interface GlobeRotation {
	x: number;
	y: number;
	z: number;
}

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
	// Refs

	const globeRef = useRef<any>();
	const containerRef = useRef<HTMLDivElement>(null);

	// State
	const [isRotating, setIsRotating] = useState(autoRotate);
	const [globeReady, setGlobeReady] = useState(false);

	// GSAP animation for rotation
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

	// Additional scroll-based animation
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

	// Handle globe initialization
	const handleGlobeReady = () => {
		setGlobeReady(true);
		if (globeRef.current) {
			// Initial rotation setup
			globeRef.current.controls().autoRotate = isRotating;
			globeRef.current.controls().autoRotateSpeed = rotationSpeed;
			globeRef.current.controls().enableZoom = false;
		}
	};

	// Toggle rotation
	const toggleRotation = () => {
		setIsRotating(!isRotating);
	};

	// Reset rotation
	const resetRotation = () => {
		if (globeRef.current) {
			globeRef.current.controls().autoRotate = false;
			globeRef.current.controls().reset();
			setIsRotating(false);

			// Resume after a delay if autoRotate is enabled
			setTimeout(() => {
				setIsRotating(autoRotate);
			}, 1000);
		}
	};

	// Gen random data
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
		<div ref={containerRef} className={`relative ${className}`}>
			{/* Globe container */}
			<div className="relative w-full">
				<Globe
					ref={globeRef}
					width={width}
					height={height}
					bumpImageUrl={bumpImageUrl}
					globeImageUrl={globeImageUrl}
					/* globeTileEngineUrl={(x, y, l) =>
						`https://tile.openstreetmap.org/${l}/${x}/${y}.png`
					} */

					backgroundColor={backgroundColor}
					onGlobeReady={handleGlobeReady}
					animateIn
					showAtmosphere
					atmosphereColor="lightskyblue"
					atmosphereAltitude={0}
					showGraticules={false}
					enablePointerInteraction={false}
					arcsData={arcsData}
					arcColor="color"
					arcDashLength={() => Math.random()}
					arcDashGap={() => Math.random()}
					arcDashAnimateTime={() => Math.random() * 4000 + 1000}
				/>

				{/* Custom overlay */}
				{/* <div className="absolute bottom-4 left-4 pointer-events-none">
					<div className="bg-black/50 text-white text-sm px-3 py-1 rounded-lg backdrop-blur-sm">
						Earth Visualization
					</div>
				</div> */}
			</div>

			{/* Controls */}
			<div className="absolute bottom-4 right-4 flex space-x-2">
				{/* <button
					onClick={toggleRotation}
					className="bg-white/90 hover:bg-white text-gray-800 px-3 py-1 rounded-lg text-sm font-medium shadow-md transition-all backdrop-blur-sm"
				>
					{isRotating ? "Pause" : "Play"}
				</button> */}
				{/* <button
					onClick={resetRotation}
					className="bg-white/90 hover:bg-white text-gray-800 px-3 py-1 rounded-lg text-sm font-medium shadow-md transition-all backdrop-blur-sm"
				>
					Reset
				</button> */}
			</div>

			{/* Loading indicator */}
			{!globeReady && (
				<div className="absolute inset-0 flex items-center justify-center bg-transparent">
					<div className="text-(--text)">Loading...</div>
				</div>
			)}
		</div>
	);
};

export default RotatingEarth;
