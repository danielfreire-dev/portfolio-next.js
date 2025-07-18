import Link from "next/link";
import Image from "next/image";

import "../../styles/styles.css";
import { kolker } from "../../fonts";
import { montserrat } from "../../fonts";
import { nanoid } from "nanoid";

import LocaleSwitcher from "./LocaleSwitcher";
import { type getDictionary } from "@/app/i18n/get-dictionary";

export const Sidenav = ({
	dictionary,
}: {
	dictionary: Awaited<ReturnType<typeof getDictionary>>["sidenav"];
}) => {
	/* const { userLanguage, setUserLanguage } = useAppContext(); */

	// Handle language selection change
	/* const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setUserLanguage(e.target.value as UserLanguageType);
	}; */

	// Type guard to ensure userLanguage exists in json
	/* if (!json[userLanguage]) {
		console.error(`Language ${userLanguage} not found in data`);
		setUserLanguage("en-US"); // Fallback to default language
		return null;
	} */

	const nav = dictionary.links.map((data) => {
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
		<nav className="hidden md:sticky  top-0 left-0 h-screen w-64 z-50 flex-shrink-0 flex-grow-0 p-4 bg-black shadow-lg md:flex flex-col justify-between">
			<Link href="/">
				<h1
					className={`${kolker.className} text-6xl capitalize transition delay-150 duration-900 ease-in-out hover:text-orange-400`}
				>
					daniel freire
				</h1>
			</Link>

			<ul className={`capitalize ${montserrat.className}`}>{nav}</ul>
			<section>
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

				{/* <div>
					<select
						name="language"
						id="language"
						className={`${montserrat.className} hover:cursor-pointer`}
						defaultValue={userLanguage}
						onChange={handleLanguageChange}
					>
						<option value="pt-PT">🇵🇹 Português</option>
						<option value="en-US">🇺🇸 English</option>
					</select>
					<button type="button" name="theme-switcher"></button>
				</div> */}
				<LocaleSwitcher />
				<footer className={`${montserrat.className}`}>
					{dictionary.footer.blurb}{" "}
					<a
						href="https://github.com/danielfreire-dev/"
						target="_blank"
						rel="noopener noreferrer"
					>
						Daniel Freire
					</a>
				</footer>
			</section>
		</nav>
	);
};

export default Sidenav;
