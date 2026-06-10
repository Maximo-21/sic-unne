import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const sesionCookie = request.cookies.get('sesion_sic');
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith('/dashboard') || pathname.startsWith('/student')) {
    if (!sesionCookie?.value) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
