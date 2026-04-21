"use client"
import { useState } from 'react'
import { authService } from '@/services/authService'

interface Props {
  onLoginSuccess: (user: any) => void;
}

export default function LoginForm({ onLoginSuccess }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const dni = formData.get('dni') as string
    const pass = formData.get('pass') as string

    try {
      const { data, error: authError } = await authService.login(dni, pass)
      if (authError || !data) throw new Error('DNI o contraseña incorrectos')
      onLoginSuccess(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white font-body">
      {/* 🟦 LADO IZQUIERDO: Branding Institucional */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary-unne p-16 flex-col justify-between relative overflow-hidden text-white">
        {/* Círculo decorativo con clases canónicas (w-150 h-150) */}
        <div className="absolute top-[-10%] left-[-10%] w-150 h-150 bg-white/5 rounded-full blur-[120px]"></div>
        
        <div className="relative z-10">
          <div className="inline-block px-4 py-2 bg-white/10 rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase mb-8 border border-white/10">
            Universidad Nacional del Nordeste
          </div>
          <h1 className="text-8xl font-black tracking-tighter mb-6 leading-none">SIC.UNNE</h1>
          <p className="text-xl text-white/60 max-w-md font-medium leading-relaxed">
            Scholastic Atelier: Innovación digital para la gestión académica.
          </p>
        </div>

        <div className="relative z-10 flex gap-16 font-headline">
          <div>
            <p className="text-4xl font-black italic tracking-tighter">2026</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Ciclo Lectivo</p>
          </div>
          <div>
            <p className="text-4xl font-black italic tracking-tighter uppercase">UNNE</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Rectorado</p>
          </div>
        </div>
      </div>

      {/* ⬜ LADO DERECHO: Formulario */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 lg:p-24 bg-surface-lavender/10">
        <div className="w-full max-w-105 space-y-12">
          <div className="space-y-4">
            <div className="w-14 h-14 bg-primary-unne/10 rounded-2xl flex items-center justify-center mb-8 shadow-sm">
               <span className="material-symbols-outlined text-primary-unne text-3xl">fingerprint</span>
            </div>
            <h2 className="text-5xl font-black text-zinc-900 tracking-tight">Bienvenido</h2>
            <p className="text-zinc-400 text-sm font-semibold">Ingrese sus credenciales administrativas.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Email / DNI</label>
              <input name="dni" required className="w-full bg-white border-b-2 border-zinc-100 px-6 py-5 outline-none focus:border-primary-unne transition-all text-zinc-800 font-bold text-sm" placeholder="40123456" />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Contraseña</label>
              <input name="pass" type="password" required className="w-full bg-white border-b-2 border-zinc-100 px-6 py-5 outline-none focus:border-primary-unne transition-all text-zinc-800 font-bold text-sm" placeholder="••••••••" />
            </div>

            {error && <div className="p-4 bg-red-50 text-red-600 text-[10px] font-black text-center rounded-2xl border border-red-100 uppercase animate-pulse">{error}</div>}

            <button disabled={loading} className="w-full bg-primary-unne hover:opacity-95 text-white font-black py-6 rounded-2xl shadow-2xl shadow-primary-unne/30 transition-all active:scale-[0.98] uppercase text-xs tracking-[0.3em]">
              {loading ? 'Validando...' : 'Iniciar Sesión'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}