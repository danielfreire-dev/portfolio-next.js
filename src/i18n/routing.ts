import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
	// A list of all locales that are supported
	locales: ["en", "pt"],

	// Used when no locale matches
	defaultLocale: "en",
	pathnames: {
		"/": "/",
		"/about": { pt: "/sobre" },
		"/portfolio": { pt: "/portfólio" },
		"/contact": { pt: "/contactos" },
		"/privacy-policy": { pt: "/política-de-privacidade" },
		"/terms-of-service": { pt: "/termos-de-servico" },
		"/cookies-policy": { pt: "/política-de-cookies" },
		"/accessibility-statement": { pt: "/declaracao-de-acessibilidade" },
		"/sitemap.xml": { pt: "/sitemap.xml" },
		"/robots.txt": { pt: "/robots.txt" },
		"/404": { pt: "/404" },
		"/resume": { pt: "/curriculo" },
	},
});
