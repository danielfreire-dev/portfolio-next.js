"use client";
import Link from "next/link";
import Image from "next/image";

import { kolker } from "../../fonts";
import { montserrat } from "../../fonts";

import LocaleSwitcher from "./LocaleSwitcher";
import { useTranslations } from "next-intl";
import NavigationList from "./NavigationList";

const Sidenav = () => {
	const t = useTranslations("sidenav");

	return (
		<nav className="hidden lg:sticky  top-0 left-0 h-screen w-64 z-50 flex-shrink-0 flex-grow-0 p-4 lg:flex flex-col justify-between items-center">
			<Link href="/">
				<h1
					className={`${kolker.className} text-6xl capitalize transition delay-150 duration-900 ease-in-out hover:text-orange-400`}
				>
					{t("header.title")}
				</h1>
			</Link>
			<ul className="capitalize">
				<NavigationList />
			</ul>
			<section className="flex flex-col justify-center">
				<div className="flex justify-center gap-2">
					<a
						href={t("footer.icons.github.link")}
						target="_blank"
						rel="noopener noreferrer"
					>
						<Image
							src={t("footer.icons.github.src")}
							alt={t("footer.icons.github.alt")}
							width={20}
							height={20}
						/>
					</a>
					<a
						href={t("footer.icons.linkedin.link")}
						target="_blank"
						rel="noopener noreferrer"
					>
						<Image
							src={t("footer.icons.linkedin.src")}
							alt={t("footer.icons.linkedin.alt")}
							width={20}
							height={20}
						/>
					</a>
				</div>

				<LocaleSwitcher />
				<footer
					className={`${montserrat.className}`}
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
			</section>
		</nav>
	);
};

export default Sidenav;
