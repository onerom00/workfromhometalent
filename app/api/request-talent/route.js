import { NextResponse } from 'next/server'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

// Inicializar conexión a la base de datos
async function openDb() {
  return open({
    filename: './requests.db',
    driver: sqlite3.Database
  })
}

// Crear tabla si no existe
async function createTableIfNotExists(db) {
  await db.run(`
    CREATE TABLE IF NOT EXISTS requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      company TEXT,
      email TEXT,
      role TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)
}

export async function POST(request) {
  try {
    // Leer el cuerpo como JSON
    const data = await request.json()
    const { name, company, email, role } = data

    // Guardar en SQLite
    const db = await openDb()
    await createTableIfNotExists(db)
    await db.run(
      'INSERT INTO requests (name, company, email, role) VALUES (?, ?, ?, ?)',
      [name, company, email, role]
    )
    await db.close()

    // Configurar y enviar correo
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false // ⚠️ Ignora certificados autofirmados (solo en desarrollo)
      }
    })

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER,
      subject: 'Nueva solicitud de talento',
      html: `
        <h2>Solicitud Recibida</h2>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Empresa:</strong> ${company}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Rol:</strong> ${role}</p>
      `
    })

    return NextResponse.json({ message: 'Solicitud recibida correctamente.' })
  } catch (error) {
    console.error('Error al procesar la solicitud:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
