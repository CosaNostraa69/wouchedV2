import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  console.log('Token in middleware:', token); // Ajoute des logs pour vérifier si le token est bien reçu.
    const path = request.nextUrl.pathname

  console.log('Token in middleware:', token)  // Log pour vérifier le token

  // Ne pas rediriger pour les pages d'authentification ou les API publiques
  const isAuthPage = path.startsWith('/auth')
  const isApiAuth = path.startsWith('/api/auth')

  if (!token && !isAuthPage && !isApiAuth) {
    // Rediriger uniquement si l'utilisateur n'est pas authentifié et essaie d'accéder à des pages protégées
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }

  // Gérer l'accès basé sur le rôle
  if (path.startsWith('/admin') && token?.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/unauthorized', request.url))
  }

  if (path.startsWith('/employer') && token?.role !== 'EMPLOYER') {
    return NextResponse.redirect(new URL('/unauthorized', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/employer/:path*', '/profile/:path*', '/users/:path*', '/api/:path*'],
}
