import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const defaultLocale = 'ar';
const supportedLocales = ['ar', 'en'];

function getLocale(request: NextRequest): string {
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  if (cookieLocale && supportedLocales.includes(cookieLocale)) {
    return cookieLocale;
  }
  
  const acceptLang = request.headers.get('Accept-Language');
  if (acceptLang) {
    if (acceptLang.includes('en')) return 'en';
  }
  
  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // 1. I18N LOCALE HANDLING (Cookie-based to avoid rewriting all paths)
  const locale = getLocale(request);
  if (!request.cookies.has('NEXT_LOCALE')) {
    response.cookies.set('NEXT_LOCALE', locale, { path: '/' });
  }
  
  // Expose locale to headers so Server Components can read it
  response.headers.set('x-locale', locale);

  // 2. EDGE AUTHENTICATION
  const session = request.cookies.get('__session')?.value || request.cookies.get('authToken')?.value;
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname.startsWith('/admin');

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
