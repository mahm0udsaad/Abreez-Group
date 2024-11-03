import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { languages, fallbackLng } from "./app/i18n/settings";

// Public routes for Clerk (sign-in, sign-up pages)
const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);
const isDashboardRoute = createRouteMatcher([
  "/en/dashboard(.*)",
  "/ar/dashboard(.*)",
]);

// Locale detection function
function getLocale(request) {
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  if (cookieLocale && languages.includes(cookieLocale)) {
    return cookieLocale;
  }

  const negotiatorHeaders = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));
  const browserLanguages = new Negotiator({
    headers: negotiatorHeaders,
  }).languages();
  return matchLocale(browserLanguages, languages, fallbackLng);
}

// Handle locale redirect
function handleLocaleRedirect(request) {
  const pathname = request.nextUrl.pathname;
  const pathnameIsMissingLocale = languages.every(
    (locale) =>
      !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  );

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
  }

  return null;
}

export default clerkMiddleware(async (auth, request) => {
  // Skip locale handling for public routes
  if (isPublicRoute(request)) {
    return NextResponse.next();
  }

  if (isDashboardRoute(request)) {
    console.log("dashboard route");

    await auth.protect();
  }

  // Handle locale redirect if needed
  const localeResponse = handleLocaleRedirect(request);
  if (localeResponse) {
    return localeResponse;
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
