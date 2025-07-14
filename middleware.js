import { NextResponse } from 'next/server'

export function middleware(request) {
  const { pathname } = request.nextUrl

  // Proteger solo la ruta /admin
  if (pathname.startsWith('/admin')) {
    const session = request.cookies.get('session')?.value

    if (session !== 'authenticated') {
      const loginUrl = new URL('/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

// Aplicar el middleware solo a la ruta /admin
export const config = {
  matcher: ['/admin']
}
