// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Optional matcher function to explicitly define allowed routes
const isProtectedRoute = createRouteMatcher([
  '/((?!_next/static|_next/image|favicon.ico).*)',
]);

export default clerkMiddleware((auth, req: NextRequest) => {
  if (isProtectedRoute(req)) {
    // You could check user auth here if needed
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
