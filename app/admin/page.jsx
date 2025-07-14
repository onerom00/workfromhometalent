'use client'

import { useState, useEffect } from 'react'

export default function AdminPage() {
  const [authorized, setAuthorized] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [requests, setRequests] = useState([])

  const SECRET = 'talentkey2025'

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === SECRET) {
      setAuthorized(true)
      fetchRequests()
    } else {
      setError('Clave incorrecta.')
    }
  }

  const fetchRequests = async () => {
    const res = await fetch('/api/get-requests')
    const data = await res.json()
    setRequests(data)
  }

  const exportToExcel = async () => {
    const XLSX = await import('xlsx')
    const worksheet = XLSX.utils.json_to_sheet(requests)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Solicitudes')
    XLSX.writeFile(workbook, 'solicitudes.xlsx')
  }

  const exportToPDF = async () => {
    const { jsPDF } = await import('jspdf')
    const autoTable = (await import('jspdf-autotable')).default

    const doc = new jsPDF()
    doc.text('Solicitudes Recibidas', 14, 15)

    const headers = [['Nombre', 'Empresa', 'Email', 'Rol']]
    const rows = requests.map(req => [req.name, req.company, req.email, req.role])

    autoTable(doc, {
      startY: 20,
      head: headers,
      body: rows
    })

    doc.save('solicitudes.pdf')
  }

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md">
          <h1 className="text-2xl mb-4">Acceso Panel Admin</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Clave secreta"
            className="border p-2 w-full mb-4"
          />
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Entrar</button>
        </form>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl mb-4">Solicitudes Recibidas</h1>
      <div className="mb-4 flex gap-4">
        <button onClick={exportToExcel} className="px-4 py-2 bg-green-600 text-white rounded">
          Exportar a Excel
        </button>
        <button onClick={exportToPDF} className="px-4 py-2 bg-red-600 text-white rounded">
          Exportar a PDF
        </button>
      </div>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Nombre</th>
            <th className="p-2 border">Empresa</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Rol</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req, i) => (
            <tr key={i}>
              <td className="p-2 border">{req.name}</td>
              <td className="p-2 border">{req.company}</td>
              <td className="p-2 border">{req.email}</td>
              <td className="p-2 border">{req.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
