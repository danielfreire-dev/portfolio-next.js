"use client";
/* import Link from "next/link"; */

import LocaleSwitcher from "./LocaleSwitcher";
import { useTranslations } from "next-intl";
import NavigationList from "./NavigationList";
import { GitHubIcon, LinkedInIcon } from "../svgs";
import { TransitionLink } from "./TransitionLink";
import LegalLinks from "./LegalLinks";
import ThemeToggle from "../ThemeToggle";

const Sidenav = () => {
	const t = useTranslations("sidenav");

	return (
		<nav
			id="sidenav"
			className="fixed lg:sticky top-0 left-0 h-screen w-64 z-50 flex-shrink-0 flex-grow-0 p-4 flex flex-col justify-between items-center
			transform -translate-x-full lg:translate-x-0 transition-transform duration-300 ease-in-out
			bg-background lg:bg-transparent
			lg:relative"
		>
			{/* Close button for mobile */}
			<button
				className="lg:hidden absolute top-4 right-4 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
				onClick={() =>
					document.getElementById("sidenav")?.classList.add("-translate-x-full")
				}
				aria-label="Close menu"
			>
				<svg
					className="w-6 h-6"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</button>

			<div>
				<TransitionLink href="/" inputData="Logo">
					<h1
						className="text-5xl capitalize flex justify-center text-(--primary) mt-5 transition delay-150 duration-900 ease-in-out hover:text-(--accent1)"
						id="logo"
					>
						{t("header.title")}
					</h1>
				</TransitionLink>
				<h3 className="flex justify-center mb-2">{t("header.role")}</h3>
			</div>
			<ul className="capitalize">
				<NavigationList />
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

				<div className="flex flex-nowrap">
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
	);
};

export default Sidenav;
