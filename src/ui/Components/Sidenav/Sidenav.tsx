import Link from "next/link";
import Image from "next/image";

import "../../styles/styles.css";
import { kolker } from "../../fonts";
import { montserrat } from "../../fonts";
import { nanoid } from "nanoid";

import LocaleSwitcher from "./LocaleSwitcher";
import { useTranslations } from "next-intl";
import NavigationLink from "./NavigationLink";

const Sidenav = () => {
	const t = useTranslations("sidenav");

	/* const nav = {t("links")}.map((data) => {
		const lang = pathname.split("/")[1];

		const isActive =
			pathname === data.link ||
			(pathname.startsWith(data.link) && data.link !== "/")
				? " active"
				: "";

		return (
			<li className={`navLinks${isActive}`} key={nanoid()}>
				<Link href={`/${lang}${data.link}`}>{data.name}</Link>
			</li>
		);
	}); */

	return (
		<nav className="hidden md:sticky  top-0 left-0 h-screen w-64 z-50 flex-shrink-0 flex-grow-0 p-4 bg-black shadow-lg md:flex flex-col justify-between">
			<Link href="/">
				<h1
					className={`${kolker.className} text-6xl capitalize transition delay-150 duration-900 ease-in-out hover:text-orange-400`}
				>
					{t("header.title")}
				</h1>
			</Link>

			<ul className={`capitalize ${montserrat.className}`}>
				<NavigationLink href={t("links[0].link")}>
					{t("links[0].name")}
				</NavigationLink>
				<NavigationLink href={t("links[1].link")}>
					{t("links[1].name")}
				</NavigationLink>
				<NavigationLink href={t("links[2].link")}>
					{t("links[2].name")}
				</NavigationLink>
				<NavigationLink href={t("links[3].link")}>
					{t("links[3].name")}
				</NavigationLink>
			</ul>
			<section>
				<div className="flex gap-2">
					<a
						href={t("footer.icons.github.link")}
						target="_blank"
						rel="noopener noreferrer"
					>
						<Image
							src={t("footer.icons.github.link")}
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
