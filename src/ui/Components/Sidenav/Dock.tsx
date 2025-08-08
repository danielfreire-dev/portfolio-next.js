"use client";
import LocaleSwitcherMobile from "./LocaleSwitcherMobile";
import NavigationList from "./NavigationList";

const Dock = () => {
	return (
		<nav className="lg:hidden fixed z-20 bottom-0 left-0 w-screen dark:bg-(--background)">
			<ul className="flex flex-row justify-evenly align-center capitalize">
				<NavigationList />
				<LocaleSwitcherMobile />
			</ul>
		</nav>
	);
};

export default Dock;
