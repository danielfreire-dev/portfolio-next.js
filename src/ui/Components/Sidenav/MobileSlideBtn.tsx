import { useTranslations } from "next-intl";
import { LineMdCloseToMenuAltTransition } from "../svgs/LineMdCloseToMenuAltTransition";
import { LineMdMenuToCloseAltTransition } from "../svgs/LineMdMenuToCloseAltTransition";

/**
 * MobileSlideBtn - Toggle button for the mobile sidenav.
 *
 * Renders a fixed-position button that toggles the sidenav open/closed on small
 * screens. The icon animates between a hamburger menu and a close (X) icon
 * depending on the `isOpen` state. The label slides horizontally to follow the
 * sidenav's position.
 */
const MobileSlideBtn = ({
	isOpen,
	setIsOpen,
}: {
	/** Whether the sidenav is currently open. */
	isOpen: boolean;
	/** State setter to toggle the sidenav open/closed. */
	setIsOpen: (value: boolean | ((prevVar: boolean) => boolean)) => void;
}) => {
	const t = useTranslations("svgTitles");
	const toggleSidenav = () => {
		setIsOpen((prev) => !prev);
	};

	const icon =
		isOpen ?
			<LineMdMenuToCloseAltTransition title={t("menuToClose")} />
		:	<LineMdCloseToMenuAltTransition title={t("closeToMenu")} />;

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
				${isOpen ? "translate-x-56" : "translate-x-4"}`}>
				{icon}
			</label>
		</>
	);
};
export default MobileSlideBtn;
