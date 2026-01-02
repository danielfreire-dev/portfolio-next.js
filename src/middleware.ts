import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
	matcher: [
		"/((?!api|_next/static|_next/image|trpc|_next|_vercel|favicon.ico|.*/opengraph-image|sitemap.xml|.*\\.svg$|.*\\.png$|.*\\.webp$|.*\\.gif$|.*\\.txt$).*)",
	],
};
