import { NextResponse } from 'next/server'
import { serialize } from 'cookie'

const VALID_EMAIL = 'admin@workfromhometalent.com'
const VALID_PASSWORD = 'talentkey2025'

export async function POST(request) {
  const body = await request.json()
  const { email, password } = body

  if (email === VALID_EMAIL && password === VALID_PASSWORD) {
    const response = NextResponse.json({ success: true })
    response.headers.set('Set-Cookie', serialize('session', 'authenticated', {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 8 // 8 horas
    }))
    return response
  }

  return NextResponse.json({ success: false }, { status: 401 })
}
