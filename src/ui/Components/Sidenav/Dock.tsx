"use client";
import LocaleSwitcherMobile from "./LocaleSwitcherMobile";
import NavigationList from "./NavigationList";

const Dock = () => {
	return (
		<nav className="lg:hidden fixed bottom-0 left-0 w-screen dark:bg-black dock">
			<ul className="flex flex-row justify-evenly align-center capitalize">
				<NavigationList />
				<LocaleSwitcherMobile />
			</ul>
		</nav>
	);
};

export default Dock;
