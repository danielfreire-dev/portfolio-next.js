import { defineRouting } from "next-intl/routing";

/**
 * Internationalization routing configuration for the portfolio.
 *
 * Defines supported locales, the default fallback locale, and localized
 * pathname mappings for every route in the application.
 */
export const routing = defineRouting({
	/** All locales the application supports. */
	locales: ["pt", "en", "dk", "pl", "de", "cz"],

	/** Default locale used when no locale matches the request. */
	defaultLocale: "en",

	/** Pathname-based routing with per-locale overrides. */
	pathnames: {
		"/": "/",
		"/about": {
			pt: "/sobre",
			dk: "/om",
			pl: "/o-mnie",
			de: "/ueber-mich",
			cs: "/o-mne",
		},
		"/portfolio": {
			pt: "/portfolio",
			dk: "/portfolio",
			pl: "/portfolio",
			de: "/portfolio",
			cs: "/portfolio",
		},
		"/contact": {
			pt: "/contactos",
			dk: "/kontakt",
			pl: "/kontakt",
			de: "/kontakt",
			cs: "/kontakt",
		},
		"/privacy-policy": {
			pt: "/politica-privacidade",
			dk: "/privatlivspolitik",
			pl: "/polityka-prywatnosci",
			de: "/datenschutz",
			cs: "/ochrana-osobnich-udaju",
		},
		"/services": {
			pt: "/servicos",
			dk: "/ydelser",
			pl: "/uslugi",
			de: "/dienstleistungen",
			cs: "/sluzby",
		},
		"/services/[slug]": {
			pt: "/servicos/[slug]",
			dk: "/ydelser/[slug]",
			pl: "/uslugi/[slug]",
			de: "/dienstleistungen/[slug]",
			cs: "/sluzby/[slug]",
		},
		"/terms-of-service": {
			pt: "/termos-servico",
			dk: "/servicevilkår",
			pl: "/regulamin",
			de: "/nutzungsbedingungen",
			cs: "/podminky-sluzby",
		},
		"/cookies-policy": {
			pt: "/politica-cookies",
			dk: "/cookiepolitik",
			pl: "/polityka-cookies",
			de: "/cookie-richtlinie",
			cs: "/politika-cookies",
		},
		"/accessibility-statement": {
			pt: "/declaracao-acessibilidade",
			dk: "/tilgængelighedserklæring",
			pl: "/deklaracja-dostepnosci",
			de: "/barrierefreiheitserklaerung",
			cs: "/prohlaseni-o-pristupnosti",
		},
		"/sitemap.xml": {
			pt: "/sitemap.xml",
			dk: "/sitemap.xml",
			pl: "/sitemap.xml",
			de: "/sitemap.xml",
			cs: "/sitemap.xml",
		},
		"/robots.txt": {
			pt: "/robots.txt",
			dk: "/robots.txt",
			pl: "/robots.txt",
			de: "/robots.txt",
			cs: "/robots.txt",
		},
		"/404": {
			pt: "/404",
			dk: "/404",
			pl: "/404",
			de: "/404",
			cs: "/404",
		},
		"/resume": {
			pt: "/curriculo",
			dk: "/cv",
			pl: "/cv",
			de: "/lebenslauf",
			cs: "/zivotopis",
		},
		"/prices": {
			pt: "/precos",
			dk: "/priser",
			pl: "/cennik",
			de: "/preise",
			cs: "/ceny",
		},
	},
});
