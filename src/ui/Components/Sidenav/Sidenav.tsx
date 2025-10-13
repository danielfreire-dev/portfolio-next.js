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

const Sidenav = () => {
	const [isOpen, setIsOpen] = useState<boolean>(true);
	const t = useTranslations("sidenav");

	return (
		<>
			<nav
				id="sidenav"
				className={`fixed lg:sticky top-0 left-0 h-screen w-64 z-50 flex-shrink-0 flex-grow-0 p-4 flex flex-col justify-between items-center
				bg-background lg:bg-transparent
				transform transition-transform duration-500 ease-in-out
				${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
			>
				<div>
					<TransitionLink
						href="/"
						inputData="Logo"
						isOpen={isOpen}
						setIsOpen={setIsOpen}
					>
						<h1
							className="text-5xl capitalize flex justify-center text-(--primary) mt-5 transition delay-150 duration-900 ease-in-out hover:text-(--accent1)"
							id="logo"
						>
							{t("header.title")}
						</h1>
					</TransitionLink>
					<h3 className="flex justify-center mb-2 capitalize">
						{t("header.role")}
					</h3>
				</div>
				<ul className="capitalize">
					<NavigationList isOpen={isOpen} setIsOpen={setIsOpen} />
				</ul>
				<section className="flex flex-col justify-center">
					<div className="flex justify-center gap-2">
						<a
							href={t("footer.icons.github.link")}
							target="_blank"
							rel="noopener noreferrer"
							className="sidenav-icons hover:scale-140 delay-150 ease-in duration-400"
						>
							<GitHubIcon />
						</a>
						<a
							href={t("footer.icons.linkedin.link")}
							target="_blank"
							rel="noopener noreferrer"
							className="sidenav-icons hover:scale-140 delay-150 ease-in duration-400"
						>
							<LinkedInIcon />
						</a>
					</div>

					<div className="flex flex-nowrap justify-between">
						<LocaleSwitcher />
						<ThemeToggle />
					</div>

					<footer
						className="flex justify-center mt-2 whitespace-pre-wrap"
						aria-label="footer"
						aria-details="footer"
						role="contentinfo"
					>
						{t("footer.blurb")}{" "}
						<a
							href="https://github.com/danielfreire-dev/"
							target="_blank"
							rel="noopener noreferrer"
							className="underline capitalize"
							aria-label="Daniel Freire's GitHub"
							title="Daniel Freire's GitHub"
							aria-details="Daniel Freire's GitHub"
						>
							{t("header.title")}
						</a>
					</footer>
					<LegalLinks />
				</section>
			</nav>
			<MobileSlideBtn isOpen={isOpen} setIsOpen={setIsOpen} />
		</>
	);
};

export default Sidenav;
