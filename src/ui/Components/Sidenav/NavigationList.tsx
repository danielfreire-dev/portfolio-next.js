import NavigationLink from "./NavigationLink";
import { useTranslations } from "next-intl";
import { useIsActivePath } from "@/ui/hooks/useIsActivePath";

/** Describes a single navigation link entry from the translation file. */
interface NavLink {
	/** The route path this link points to. */
	link:
		| "/"
		| "/about"
		| "/portfolio"
		| "/contact"
		| "/privacy-policy"
		| "/services"
		| "/sitemap.xml"
		| "/robots.txt"
		| "/404"
		| "/prices";
	/** Display name for the link. */
	name: string;
	/** Whether the sidenav is currently open (for mobile close-on-navigate). */
	isOpen?: boolean;
	/** State setter to close the sidenav after navigation. */
	setIsOpen?: (value: boolean | ((prevVar: boolean) => boolean)) => void;
}

/**
 * NavigationList - Renders the list of navigation links in the sidenav.
 *
 * Reads link definitions from the `sidenav.links` translation key, determines
 * which link is active based on the current pathname using the shared
 * `useIsActivePath` hook (locale-aware matching), and renders each as a
 * `NavigationLink` inside an `<li>`.
 */
const NavigationList = ({
	isOpen,
	setIsOpen,
}: {
	isOpen: boolean;
	setIsOpen: (value: boolean | ((prevVar: boolean) => boolean)) => void;
}) => {
	const isActive = useIsActivePath();
	const t = useTranslations("sidenav");

	const nav = t.raw("links").map((data: NavLink) => {
		const isActiveClass = isActive(data.link) ? " active" : "";

		return (
			<li
				className={`navLinks${isActiveClass} flex justify-center`}
				key={data.link}>
				<NavigationLink
					href={data.link}
					isOpen={isOpen}
					setIsOpen={setIsOpen}>
					{data.name}
				</NavigationLink>
			</li>
		);
	});

	return nav;
};

export default NavigationList;
