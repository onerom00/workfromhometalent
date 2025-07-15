'use client'

import React, { useState } from 'react';

export default function HomePage() {
  console.log("Página /home cargada");

  const [form, setForm] = useState({ name: '', company: '', email: '', role: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/request-talent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('✅ Request submitted successfully.');
        setForm({ name: '', company: '', email: '', role: '' });
      } else {
        setMessage('❌ ' + data.message);
      }
    } catch (err) {
      setMessage('❌ Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white px-4 py-12 text-gray-900">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">
          Find the Best Work-from-Home Talent, Fast.
        </h1>
        <p className="text-lg mb-6">
          We connect companies with top-tier remote professionals in less than 7 days — guaranteed.
        </p>
      </div>

      <div className="max-w-2xl mx-auto mt-12">
        <form onSubmit={handleSubmit} className="space-y-4 bg-gray-100 p-6 rounded-xl shadow-md">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your Name"
            className="w-full p-2 rounded border"
          />
          <input
            name="company"
            value={form.company}
            onChange={handleChange}
            placeholder="Company Name"
            className="w-full p-2 rounded border"
          />
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email Address"
            type="email"
            className="w-full p-2 rounded border"
          />
          <input
            name="role"
            value={form.role}
            onChange={handleChange}
            placeholder="Type of Role Needed"
            className="w-full p-2 rounded border"
          />
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded">
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
          {message && <p className="text-center mt-2 text-sm">{message}</p>}
        </form>
      </div>
    </main>
  );
}
