import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

const LoginPage: React.FC = () => {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      await login(email.trim(), password)
      navigate('/')
    } catch (err: any) {
      setError('Login failed. Check credentials or try again.')
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-800 text-white p-4">
      <div className="max-w-sm w-full space-y-6 bg-slate-700 p-6 rounded">
        <h1 className="text-2xl font-bold text-center text-emerald-400">🔐 Login</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full p-2 bg-gray-800 rounded text-sm"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full p-2 bg-gray-800 rounded text-sm"
            required
          />
          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-500 py-2 rounded text-sm"
          >
            Login
          </button>
          {error && <p className="text-red-400 text-xs">{error}</p>}
        </form>
      </div>
    </div>
  )
}

export default LoginPage