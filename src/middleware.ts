import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['en', 'nl', 'de', 'es', 'fr']
const defaultLocale = 'nl'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Skip public files and API routes
  if (
    pathname.includes('.') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next')
  ) {
    return
  }

  // Check if the pathname is missing a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return

  // Redirect if there is no locale
  const locale = defaultLocale
  request.nextUrl.pathname = `/${locale}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
}
