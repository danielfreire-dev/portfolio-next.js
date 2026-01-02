import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
	// A list of all locales that are supported
	locales: ["pt", "en", "dk", "pl", "de"],

	// Used when no locale matches
	defaultLocale: "en",
	pathnames: {
		"/": "/",
		"/about": {
			pt: "/sobre",
			dk: "/om",
			pl: "/o-mnie",
			de: "/ueber-mich",
		},
		"/portfolio": {
			pt: "/portfolio",
			dk: "/portfolio",
			pl: "/portfolio",
			de: "/portfolio",
		},
		"/contact": {
			pt: "/contactos",
			dk: "/kontakt",
			pl: "/kontakt",
			de: "/kontakt",
		},
		"/privacy-policy": {
			pt: "/politica-privacidade",
			dk: "/privatlivspolitik",
			pl: "/polityka-prywatnosci",
			de: "/datenschutz",
		},
		"/terms-of-service": {
			pt: "/termos-servico",
			dk: "/servicevilkår",
			pl: "/regulamin",
			de: "/nutzungsbedingungen",
		},
		"/cookies-policy": {
			pt: "/politica-cookies",
			dk: "/cookiepolitik",
			pl: "/polityka-cookies",
			de: "/cookie-richtlinie",
		},
		"/accessibility-statement": {
			pt: "/declaracao-acessibilidade",
			dk: "/tilgængelighedserklæring",
			pl: "/deklaracja-dostepnosci",
			de: "/barrierefreiheitserklaerung",
		},
		"/sitemap.xml": {
			pt: "/sitemap.xml",
			dk: "/sitemap.xml",
			pl: "/sitemap.xml",
			de: "/sitemap.xml",
		},
		"/robots.txt": {
			pt: "/robots.txt",
			dk: "/robots.txt",
			pl: "/robots.txt",
			de: "/robots.txt",
		},
		"/404": {
			pt: "/404",
			dk: "/404",
			pl: "/404",
			de: "/404",
		},
		"/resume": {
			pt: "/curriculo",
			dk: "/cv",
			pl: "/cv",
			de: "/lebenslauf",
		},
		"/prices": {
			pt: "/precos",
			dk: "/priser",
			pl: "/cennik",
			de: "/preise",
		},
	},
});
