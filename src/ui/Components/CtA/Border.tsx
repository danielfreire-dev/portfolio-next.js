/* eslint-disable react/self-closing-comp */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import "@/src/ui/styles/border.css";

type BorderProps<T extends React.ElementType> =
	React.ComponentPropsWithoutRef<T> & {
		as?: T;
		className?: string;
		children?: React.ReactNode;
		color?: string;
		speed?: React.CSSProperties["animationDuration"];
		thickness?: number;
	};

const Border = <T extends React.ElementType = "button">({
	as,
	className = "",
	color,
	speed = "4s",
	thickness = 4,
	children,
	...rest
}: BorderProps<T>) => {
	const Component = as || "button";
	color = "#f27a3d";

	return (
		<Component
			className={`star-border-container ${className}`}
			{...(rest as any)}
			style={{
				padding: `${thickness}px 0`,
				...(rest as any).style,
			}}
		>
			<div
				className="border-gradient-bottom"
				style={{
					background: `radial-gradient(circle, ${color}, transparent 10%)`,
					animationDuration: speed,
				}}
			></div>
			<div
				className="border-gradient-top"
				style={{
					background: `radial-gradient(circle, ${color}, transparent 10%)`,
					animationDuration: speed,
				}}
			></div>
			<div className="inner-content">{children}</div>
		</Component>
	);
};

export default Border;
