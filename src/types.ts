/** Props for rendering a single technology card in the tech stack section. */
export interface TechCardProps {
	/** Mapping of tech names to their display values. */
	techstackMap: Record<string, string>;
	/** The technology name identifier. */
	tech: string;
	/** URL or path to the technology logo image. */
	logo: string;
	/** External link to the technology's official site. */
	link: string;
	/** Alt text for the logo image. */
	alt: string;
}

/** Supported locale codes for internationalization. */
export type UserLanguageType = "pt" | "en" | "dk" | "pl" | "de" | "cz";

/** Props for the sidenav component, providing language selection controls. */
export interface SidenavProps {
	/** The currently active user language/locale. */
	userLanguage: UserLanguageType;
	/** Callback invoked when the user selects a different language. */
	onLanguageChange: (lang: UserLanguageType) => void;
}

/** A single navigation link entry in the sidenav. */
interface SidenavLinks {
	/** Display name of the link. */
	name: string;
	/** Route path the link points to. */
	link: string;
}

/** Footer content displayed at the bottom of the sidenav. */
interface SidenavFooter {
	/** Privacy policy text or link. */
	privacy: string;
	/** Rights/reserved text. */
	rights: string;
	/** Short blurb or tagline. */
	blurb: string;
}

/** Data structure for the sidenav section. */
interface SidenavData {
	/** Array of navigation links. */
	links: SidenavLinks[];
	/** Footer content. */
	footer: SidenavFooter;
}

/** Call-to-action section data. */
interface CTA {
	/** Title text for the CTA section. */
	title: string;
	/** Array of button label options (one is randomly selected). */
	button: string[];
}

/** Home page section data. */
interface Home {
	/** First carousel image identifier. */
	carousel1: string;
	/** Second carousel image identifier. */
	carousel2: string;
	/** Third carousel image identifier. */
	carousel3: string;
	/** Tech stack section heading. */
	techstack: string;
	/** Trending section heading. */
	trending: string;
}

/** Root data structure for a single locale's content. */
interface Data {
	sidenav: SidenavData;
	cta: CTA;
	home: Home;
}

/** Map of locale codes to their localized data objects. */
export type LocalizedData = Record<string, Data>;

/** Application-wide context type providing language state to the component tree. */
export interface AppContextType {
	/** The currently selected user language. */
	userLanguage: UserLanguageType;
	/** Setter to update the active language across the app. */
	setUserLanguage: (language: UserLanguageType) => void;
}

/** A single slide in the carousel. */
export interface Slide {
	/** Text content displayed on the slide. */
	carouselTxt: string;
	/** Alt text for the slide image. */
	carouselAlt: string;
	/** Image source URL for the slide. */
	carouselImg: string;
}

/** Props for the carousel component. */
export interface CarouselProps {
	/** Array of slides to render. */
	slides: Slide[];
}

/** A single item in the carousel with full metadata. */
export interface CarouselItem {
	/** Unique identifier for the item. */
	id: number;
	/** Title displayed on the slide. */
	title: string;
	/** Description text for the slide. */
	description: string;
	/** Background image URL. */
	imageUrl: string;
	/** Alt text for the image. */
	alt: string;
}

/**
 * Complete shape of the i18n message JSON files.
 * Each property maps to a namespace in the translation files.
 */
export interface Dictionary {
	about: {
		image: string;
		paragraph1: string;
		paragraph2: string;
		paragraph3: string;
		paragraph4: string;
		paragraph5: string;
		paragraph6: string;
		paragraph7: string;
		title1: string;
		title2: string;
		title3: string;
		title4: string;
		title5: string;
	};
	carousel: {
		alt: string;
		description: string;
		id: number;
		imageUrl: string;
		title: string;
		cta: string;
	}[];
	contact: {
		btn: string;
		email: string;
		label: string;
		message: string;
		firstName: string;
		lastName: string;
		phone: string;
		privacy: string;
		title: string;
		pageTitle: string;
		placeholder: {
			email: string;
			firstName: string;
			lastName: string;
			phone: string;
			message: string;
		};
	};
	cta: {
		button: string[];
		title: string;
	};
	home: {
		techstack: string;
		trending: string;
	};
	icons: {
		leftarrow: {
			alt: string;
			src: string;
		};
		rightarrow: {
			alt: string;
			src: string;
		};
	};
	portfolio: {
		pageTitle: string;
		all: string;
		cta: string[];
		projects: {
			link: string;
			src: string;
			summary: string;
			title: string;
			github: string;
			demo: string;
		}[];
		"projects-title": string;
		websites: {
			link: string;
			src: string;
			summary: string;
			title: string;
			github: string;
			demo: string;
		}[];
		"websites-title": string;
	};
	sidenav: {
		header: {
			title: string;
		};
		footer: {
			blurb: string;
			icons: {
				github: {
					alt: string;
					src: string;
					link: string;
				};
				linkedin: {
					alt: string;
					src: string;
					link: string;
				};
			};
		};
		links: {
			link: string;
			name: string;
		}[];
		privacy: string;
		rights: string;
	};
	tech: {
		link: string;
		logo: string;
		name: string;
	}[];
	services: Service[];
}

/** A navigation link with a typed route path and display name. */
export interface NavLink {
	/** The route path — restricted to known application routes. */
	link:
		| "/"
		| "/about"
		| "/portfolio"
		| "/contact"
		| "/privacy-policy"
		| "/terms-of-service"
		| "/cookies-policy"
		| "/accessibility-statement"
		| "/sitemap.xml"
		| "/robots.txt"
		| "/404"
		| "/prices";
	/** Display name for the navigation link. */
	name: string;
}

/** A service offering displayed on the services section. */
export interface Service {
	/** URL or path to the service icon. */
	icon: string;
	/** Title of the service. */
	title: string;
	/** Description text for the service. */
	text: string;
}
