"use client";
import Link from "next/link";

import LocaleSwitcher from "./LocaleSwitcher";
import { useTranslations } from "next-intl";
import NavigationList from "./NavigationList";
import ThemeToggle from "../ThemeToggle";
import { GitHubIcon, LinkedInIcon } from "../svgs";
import { TransitionLink } from "./TransitionLink";
import LegalLinks from "./LegalLinks";

const Sidenav = () => {
	const t = useTranslations("sidenav");

	return (
		<nav className="hidden lg:sticky top-0 left-0 h-screen w-64 z-15 flex-shrink-0 flex-grow-0 p-4 lg:flex flex-col justify-between items-center ">
			<TransitionLink href="/">
				<h1
					className="text-5xl capitalize flex justify-center text-(--primary) mt-5 transition delay-150 duration-900 ease-in-out hover:text-(--accent1)"
					id="logo"
				>
					{t("header.title")}
				</h1>
			</TransitionLink>
			<ul className="capitalize">
				<NavigationList />
			</ul>
			<section className="flex flex-col justify-center">
				<div className="flex justify-center gap-2 ">
					<a
						href={t("footer.icons.github.link")}
						target="_blank"
						rel="noopener noreferrer"
						className="sidenav-icons"
					>
						<GitHubIcon />
					</a>
					<a
						href={t("footer.icons.linkedin.link")}
						target="_blank"
						rel="noopener noreferrer"
						className="sidenav-icons"
					>
						<LinkedInIcon />
					</a>
				</div>
				{/* <ThemeToggle /> */}
				<LocaleSwitcher />

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
	);
};

export default Sidenav;
