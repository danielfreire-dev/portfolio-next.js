import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
	// A list of all locales that are supported
	locales: ["pt", "en"],

	// Used when no locale matches
	defaultLocale: "en",
	pathnames: {
		"/": "/",
		"/about": { pt: "/sobre" },
		"/portfolio": { pt: "/portfólio" },
		"/contact": { pt: "/contactos" },
		"/privacy-policy": { pt: "/politica-privacidade" },
		"/terms-of-service": { pt: "/termos-servico" },
		"/cookies-policy": { pt: "/politica-cookies" },
		"/accessibility-statement": { pt: "/declaracao-acessibilidade" },
		"/sitemap.xml": { pt: "/sitemap.xml" },
		"/robots.txt": { pt: "/robots.txt" },
		"/404": { pt: "/404" },
		"/resume": { pt: "/curriculo" },
		"/prices": { pt: "/precos" },
	},
});
