import { forwardRef } from "react";
import { useTranslations } from "next-intl";
import { LineMdCloseToMenuAltTransition } from "../svgs/LineMdCloseToMenuAltTransition";
import { LineMdMenuToCloseAltTransition } from "../svgs/LineMdMenuToCloseAltTransition";

/** Props for {@link MobileSlideBtn}. */
interface MobileSlideBtnProps {
	/** Whether the sidenav is currently open. */
	isOpen: boolean;
	/** State setter to toggle the sidenav open/closed. */
	setIsOpen: (value: boolean | ((prevVar: boolean) => boolean)) => void;
}

/**
 * MobileSlideBtn - Toggle button for the mobile sidenav.
 *
 * A native `<button>` (keyboard operable, WCAG 2.1.1) that toggles the sidenav
 * on small screens. It keeps one accessible name ("Menu") and reports the state
 * through `aria-expanded`, pointing at the `#sidenav` element it controls.
 * The icon animates between a hamburger and a close (X) icon, and the button
 * slides horizontally to follow the sidenav's position.
 *
 * The ref is forwarded so the sidenav can return focus here when it is closed
 * with Escape.
 */
const MobileSlideBtn = forwardRef<HTMLButtonElement, MobileSlideBtnProps>(({ isOpen, setIsOpen }, ref) => {
	const t = useTranslations("sidenav");

	const icon =
		isOpen ?
			<LineMdMenuToCloseAltTransition aria-hidden="true" />
		:	<LineMdCloseToMenuAltTransition aria-hidden="true" />;

	return (
		<button
			ref={ref}
			type="button"
			onClick={() => setIsOpen((prev) => !prev)}
			aria-expanded={isOpen}
			aria-controls="sidenav"
			aria-label={t("a11y.menu")}
			className={`lg:hidden fixed top-2 z-50 m-2 inline-flex items-center justify-center min-w-11 min-h-11 cursor-pointer hover:bg-(--surface) text-(--text-hover)
		focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--primary)
		transition-all duration-550 ease-in-out
		${isOpen ? "left-48" : "left-4"}`}>
			{icon}
		</button>
	);
});

MobileSlideBtn.displayName = "MobileSlideBtn";

export default MobileSlideBtn;
