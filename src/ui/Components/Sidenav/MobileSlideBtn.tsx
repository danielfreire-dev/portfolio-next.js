import { LineMdCloseToMenuAltTransition } from "../svgs/LineMdCloseToMenuAltTransition";
import { LineMdMenuToCloseAltTransition } from "../svgs/LineMdMenuToCloseAltTransition";

const MobileSlideBtn = ({
	isOpen,
	setIsOpen,
}: {
	isOpen: boolean;
	setIsOpen: (value: boolean | ((prevVar: boolean) => boolean)) => void;
}) => {
	const toggleSidenav = () => {
		setIsOpen((prev) => !prev);
	};

	const icon = isOpen ? (
		<LineMdMenuToCloseAltTransition />
	) : (
		<LineMdCloseToMenuAltTransition />
	);

	return (
		<>
			<input
				type="checkbox"
				name="slide-menu"
				id="slide-menu"
				className="hidden appearance-none"
				onChange={toggleSidenav}
				checked={isOpen}
				aria-label={isOpen ? "Close menu" : "Open menu"}
			/>
			<label
				htmlFor="slide-menu"
				aria-label={isOpen ? "Close menu" : "Open menu"}
				className={`lg:hidden fixed top-2 z-50 p-1.5 hover:bg-(--surface) text-(--text-hover)
				transform transition-transform duration-550 ease-in-out
				${isOpen ? "translate-x-56" : "translate-x-4"}`}
			>
				{icon}
			</label>
		</>
	);
};
export default MobileSlideBtn;
