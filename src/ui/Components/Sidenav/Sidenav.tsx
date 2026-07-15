"use client";

import LocaleSwitcher from "./LocaleSwitcher";
import { useTranslations } from "next-intl";
import NavigationList from "./NavigationList";
import { GitHubIcon, LinkedInIcon } from "../svgs";
import { TransitionLink } from "./TransitionLink";
import LegalLinks from "./LegalLinks";
import ThemeToggle from "../ThemeToggle";
import { useState } from "react";
import MobileSlideBtn from "./MobileSlideBtn";

/**
 * Sidenav - Main sidebar navigation component.
 *
 * Renders a fixed/sticky sidebar containing:
 * - Site logo and role title (linked to home)
 * - Navigation links via `NavigationList`
 * - Social icons (GitHub, LinkedIn)
 * - Locale switcher and theme toggle
 * - Footer blurb with attribution and legal links
 *
 * On mobile the sidenav slides in/out via `MobileSlideBtn`.
 */
const Sidenav = () => {
	const [isOpen, setIsOpen] = useState<boolean>(true);
	const t = useTranslations("sidenav");

	return (
		<>
			<nav
				id="sidenav"
				className={`fixed lg:sticky top-0 left-0 h-screen w-64 max-w z-50 shrink-0 grow-0 p-4 flex flex-col justify-between items-center
				bg-background lg:bg-transparent overflow-y-auto
				transform transition-transform duration-500 ease-in-out
				${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
				<div>
					<TransitionLink
						href="/"
						inputData="Logo"
						isOpen={isOpen}
						setIsOpen={setIsOpen}>
						<h1
							className="text-5xl capitalize flex justify-center text-(--primary) mt-5 transition delay-150 duration-900 ease-in-out hover:text-(--accent1)"
							id="logo">
							{t("header.title")}
						</h1>
					</TransitionLink>
					<p
						className="flex justify-center mb-2 capitalize text-lg font-semibold"
						role="doc-subtitle">
						{t("header.role")}
					</p>
				</div>
				<ul className="capitalize">
					<NavigationList
						isOpen={isOpen}
						setIsOpen={setIsOpen}
					/>
				</ul>
				<section className="flex flex-col justify-center">
					<div className="flex justify-center gap-2">
						<a
							href={t("footer.icons.github.link")}
							target="_blank"
							rel="noopener noreferrer"
							className="sidenav-icons hover:scale-140 delay-150 ease-in duration-400"
							aria-label={t("footer.icons.github.ariaLabel")}>
							<GitHubIcon title={t("footer.icons.github.title")} />
						</a>
						<a
							href={t("footer.icons.linkedin.link")}
							target="_blank"
							rel="noopener noreferrer"
							className="sidenav-icons hover:scale-140 delay-150 ease-in duration-400"
							aria-label={t("footer.icons.linkedin.ariaLabel")}>
							<LinkedInIcon title={t("footer.icons.linkedin.title")} />
						</a>
					</div>

					<div className="flex flex-nowrap justify-between">
						<LocaleSwitcher />
						<ThemeToggle />
					</div>

					<footer
						className="flex justify-center mt-2 whitespace-pre-wrap"
						aria-label="footer"
						role="contentinfo">
						{t("footer.blurb")}{" "}
						<a
							href="https://github.com/danielfreire-dev/"
							target="_blank"
							rel="noopener noreferrer"
							className="underline capitalize"
							aria-label={t("footer.icons.github.ariaLabel")}
							title="Daniel Freire's GitHub">
							{t("header.title")}
						</a>
					</footer>
					<LegalLinks />
				</section>
			</nav>
			<MobileSlideBtn
				isOpen={isOpen}
				setIsOpen={setIsOpen}
			/>
		</>
	);
};

export default Sidenav;
