import { useEffect, useState } from "react";
import Image from "next/image";
/* import sun from "svgs/sun1.svg";
import moon from "svgs/moon1.svg"; */
import { Sun, Moon } from "@/ui/Components/svgs";
import { LineMdMoonFilledToSunnyFilledLoopTransition } from "./svgs/sun";
import { LineMdSunnyFilledLoopToMoonFilledLoopTransition } from "./svgs/moon";
const ThemeToggle = () => {
	const [isDark, setIsDark] = useState(false);

	useEffect(() => {
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		setIsDark(mediaQuery.matches);

		const handleChange = (e: MediaQueryListEvent) => {
			setIsDark(e.matches);
		};

		mediaQuery.addEventListener("change", handleChange);
		return () => mediaQuery.removeEventListener("change", handleChange);
	}, []);

	return (
		<>
			<input
				type="checkbox"
				className="hidden appearance-none"
				id="theme-toggle"
				checked={isDark}
				onChange={(e) => setIsDark(e.target.checked)}
			/>
			<label
				className="toggle hover:cursor-pointer py-3 px-2"
				htmlFor="theme-toggle"
			>
				<div>
					{isDark ? (
						<LineMdSunnyFilledLoopToMoonFilledLoopTransition />
					) : (
						<LineMdMoonFilledToSunnyFilledLoopTransition />
					)}
				</div>
			</label>
		</>
	);
};

export default ThemeToggle;
