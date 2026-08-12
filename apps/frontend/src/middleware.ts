import { NextResponse, type NextRequest } from 'next/server';

// Route protection is primarily handled client-side (see (dashboard)/layout.tsx)
// because the JWT lives in a Zustand store persisted to localStorage, which
// middleware (running at the edge) cannot read. This middleware adds a light
// pass-through and is the place to extend with cookie-based auth if the
// token strategy changes to httpOnly cookies.
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/tasks/:path*'],
};
