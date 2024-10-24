import { NextResponse } from "next/server";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { languages, fallbackLng } from "./app/i18n/settings";

function getLocale(request) {
  // Check for the NEXT_LOCALE cookie first
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  if (cookieLocale && languages.includes(cookieLocale)) {
    return cookieLocale;
  }

  const negotiatorHeaders = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const availableLanguages = languages;

  const browserLanguages = new Negotiator({
    headers: negotiatorHeaders,
  }).languages();
  const locale = matchLocale(browserLanguages, availableLanguages, fallbackLng);

  return locale;
}

export function middleware(request) {
  if (
    request.nextUrl.pathname.startsWith("/api") ||
    request.nextUrl.pathname.startsWith("/fonts")
  ) {
    return NextResponse.next();
  }

  const pathname = request.nextUrl.pathname;
  const pathnameIsMissingLocale = languages.every(
    (locale) =>
      !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  );

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|jpg|png|css|js)$).*)",
  ],
};
