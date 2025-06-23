"use client";

import Link from "next/link";
import Image from "next/image";
import json from "../JSONs/text.json";
import { usePathname } from "next/navigation";

import data from "@/app/ui/JSONs/text.json";
import "../styles/styles.css";
import { kolker } from "../fonts";
import { montserrat } from "../fonts";
import { nanoid } from "nanoid";

export const Sidenav = () => {
	const pathname = usePathname();
	/* isActive = pathname.startsWith(link.href) ? "active" : ""; */

	const nav = data["en-us"].sidenav.links.map((data) => {
		const isActive =
			pathname === data.link ||
			(pathname.startsWith(data.link) && data.link !== "/")
				? " active"
				: "";

		return (
			<li className={`navLinks${isActive}`} key={nanoid()}>
				<Link href={data.link}>{data.name}</Link>
			</li>
		);
	});
	return (
		<nav className="fixed top-0 left-0 h-screen w-64 z-50 p-4 bg-black shadow-lg flex flex-col justify-between">
			<Link href="/">
				<h1
					className={`${kolker.className} text-6xl capitalize transition delay-150 duration-900 ease-in-out hover:text-orange-400`}
				>
					daniel freire
				</h1>
			</Link>

			<ul className={`capitalize ${montserrat.className}`}>{nav}</ul>

			<div className="flex gap-2">
				<a
					href="https://github.com/danielfreire-dev/"
					target="_blank"
					rel="noopener noreferrer"
				>
					<Image
						src={"/images/icons/github-square.svg"}
						alt="GitHub"
						width={20}
						height={20}
					/>
				</a>
				<a
					href="https://www.linkedin.com/in/danielfreire-swe/"
					target="_blank"
					rel="noopener noreferrer"
				>
					<Image
						src={"/images/icons/linkedin.svg"}
						alt="LinkedIn"
						width={20}
						height={20}
					/>
				</a>
			</div>

			<div>
				<select
					name="language"
					id="language"
					className={`${montserrat.className} hover:cursor-pointer`}
					defaultValue={"en-US"}
				>
					<option value="pt-PT">🇵🇹 Português</option>
					<option value="en-US">🇺🇸 English</option>
				</select>
				<button type="button" name="theme-switcher"></button>
			</div>
			<footer className={`${montserrat.className}`}>
				{json["en-us"].sidenav.footer.blurb}{" "}
				<a
					href="https://github.com/danielfreire-dev/"
					target="_blank"
					rel="noopener noreferrer"
				>
					Daniel Freire
				</a>
			</footer>
		</nav>
	);
};

export default Sidenav;
