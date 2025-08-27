export interface TechCardProps {
	techstackMap: Record<string, string>;
	tech: string;
	logo: string;
	link: string;
	alt: string;
}

// userLanguage Types
export type UserLanguageType = "pt" | "en";
export interface SidenavProps {
	userLanguage: UserLanguageType;
	onLanguageChange: (lang: UserLanguageType) => void;
}

// data JSON types
interface SidenavLinks {
	name: string;
	link: string;
}

interface SidenavFooter {
	privacy: string;
	rights: string;
	blurb: string;
}

interface SidenavData {
	links: SidenavLinks[];
	footer: SidenavFooter;
}

interface CTA {
	title: string;
	button: string[];
}

interface Home {
	carousel1: string;
	carousel2: string;
	carousel3: string;
	techstack: string;
	trending: string;
}

interface Data {
	sidenav: SidenavData;
	cta: CTA;
	home: Home;
}

export type LocalizedData = Record<string, Data>;

// App Context
export interface AppContextType {
	userLanguage: UserLanguageType;
	setUserLanguage: (language: UserLanguageType) => void;
}

// Carousel DS
export interface Slide {
	carouselTxt: string;
	carouselAlt: string;
	carouselImg: string;
}

export interface CarouselProps {
	slides: Slide[];
}

export interface CarouselItem {
	id: number;
	title: string;
	description: string;
	imageUrl: string;
	alt: string;
}

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
		}[];
		"projects-title": string;
		websites: {
			link: string;
			src: string;
			summary: string;
			title: string;
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
}

export interface NavLink {
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
	name: string;
}
