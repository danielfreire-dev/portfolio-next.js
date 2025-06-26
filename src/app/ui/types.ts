export interface TechCardProps {
	techstackMap: JSX.Element;
}

// userLanguage Types
export type UserLanguageType = "pt-PT" | "en-US";
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

interface Portfolio {
	// Define portfolio properties here
}

interface About {
	// Define about properties here
}

interface Data {
	sidenav: SidenavData;
	cta: CTA;
	home: Home;
	portfolio: Portfolio;
	about: About;
}

export interface LocalizedData {
	[key: string]: Data;
}
