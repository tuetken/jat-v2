import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

/**
 * Next.js middleware for authentication and route protection.
 * 
 * Protects all routes under (auth)/* by redirecting unauthenticated users to /login.
 * Refreshes user sessions and manages auth cookies.
 */
export async function middleware(request: NextRequest) {
  const { response, user } = await updateSession(request)

  // Protect all routes under /dashboard, /applications, /insights, etc.
  // These correspond to the (auth) route group
  const protectedPaths = ['/dashboard', '/applications', '/insights']
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  )

  if (isProtectedPath && !user) {
    // Redirect to login if accessing protected route without authentication
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirectTo', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
