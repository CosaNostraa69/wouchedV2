import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const path = request.nextUrl.pathname


  if (!token) {
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }

  // Check for role-based access
  if (request.nextUrl.pathname.startsWith('/admin') && token.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/unauthorized', request.url))
  }

  if (path.startsWith('/users/')) {
    console.log('Middleware: Allowing access to user profile page', path)
    return NextResponse.next()
}

  if (request.nextUrl.pathname.startsWith('/employer') && token.role !== 'EMPLOYER') {
    return NextResponse.redirect(new URL('/unauthorized', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/employer/:path*', '/profile/:path*','/api/:path*', '/users/:path*'],
}