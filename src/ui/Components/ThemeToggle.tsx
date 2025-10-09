import { useEffect, useState } from "react";
import { LineMdMoonFilledToSunnyFilledLoopTransition } from "./svgs/sun";
import { LineMdSunnyFilledLoopToMoonFilledLoopTransition } from "./svgs/moon";

/* import posthog from "posthog-js"; */

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

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		setIsDark(e.target.checked);
		/* captureButtonClick("themeToggle_clicked"); */
	}

	/* const captureButtonClick = (message: string) => {
		posthog.capture(message, {
			cool: true,
		});
	}; */
	return (
		<>
			<input
				type="checkbox"
				className="hidden appearance-none"
				id="theme-toggle"
				checked={isDark}
				onChange={handleChange}
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
