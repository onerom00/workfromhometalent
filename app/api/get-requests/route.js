import { NextResponse } from 'next/server'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

export async function GET() {
  try {
    const db = await open({
      filename: './talent.db',
      driver: sqlite3.Database
    })

    const requests = await db.all('SELECT * FROM requests ORDER BY id DESC')
    return NextResponse.json(requests)
  } catch (error) {
    console.error('Error al acceder a la base de datos:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
