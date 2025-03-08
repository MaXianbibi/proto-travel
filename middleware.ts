import { NextRequest, NextResponse } from 'next/server';

// Fonction middleware
export function middleware(request: NextRequest) {
  // Exemple : Rediriger vers "/login" si l'utilisateur n'a pas de token
  const token = request.cookies.get('authToken')?.value;

  if (!token && request.nextUrl.pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Sinon, continuer la requête normalement
  return NextResponse.next();
}


export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|$).*)'], // 🔥 Exclut le root "/"
};
