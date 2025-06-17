import Link from "next/link";
import Image from "next/image";
import json from "../JSONs/text.json";

import { kolker } from "../fonts";
import { montserrat } from "../fonts";

export const Sidenav = () => {
	return (
		<nav className="flex-initial flex-col flex-nowrap h-full z-10 p-4">
			<Link href="/">
				<h1 className={`${kolker.className} text-6xl`}>Daniel Freire</h1>
			</Link>

			<ul className={`capitalize ${montserrat.className}`}>
				<li className="navLinks ">
					<Link href="/">{json["en-us"].sidenav.links.home}</Link>
				</li>
				<li className="navLinks ">
					<Link href="/portfolio">{json["en-us"].sidenav.links.portfolio}</Link>
				</li>
				<li className="navLinks ">
					<Link href="/about">{json["en-us"].sidenav.links.about}</Link>
				</li>
				<li className="navLinks ">
					<Link href="/contact">{json["en-us"].sidenav.links.contact}</Link>
				</li>
			</ul>

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
					className={`${montserrat.className}`}
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
