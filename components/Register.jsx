"use client";

import React, { useState } from 'react';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.message) {
        setMessage(data.message);
        setEmail('');
        setPassword('');
      } else {
        setError(data.error || 'Error al registrar usuario');
      }
    } catch (err) {
      setError('Error de red o del servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white flex items-center justify-center py-12">
      <form
        onSubmit={handleSubmit}
        className="bg-[#1E1E1E] border border-[#333] rounded-xl shadow-md w-full max-w-md p-8 space-y-6"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-orange-500">Registro de Usuario</h2>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full bg-[#333] text-white py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="correo@ejemplo.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full bg-[#333] text-white py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Mínimo 6 caracteres"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-md font-semibold transition-colors disabled:bg-gray-600"
        >
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>
        {message && <div className="text-green-400 text-center mt-2">{message}</div>}
        {error && <div className="text-red-400 text-center mt-2">{error}</div>}
      </form>
    </div>
  );
};

export default Register;
