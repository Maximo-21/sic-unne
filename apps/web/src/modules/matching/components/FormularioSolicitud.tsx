"use client"
import { useEffect, useState } from 'react'
import { MatchingServicio } from '../services/MatchingServicio'
import { GestionAcademicaServicio } from '@/modules/gestion_academica/services/GestionAcademicaServicio'
import { Comision } from '@/modules/gestion_academica/types/Comision'

interface Props {
  onSolicitudCreada: () => void;
}

export default function FormularioSolicitud({ onSolicitudCreada }: Props) {
  const [comisiones, setComisiones] = useState<Comision[]>([])
  const [idOrigen, setIdOrigen] = useState<number | ''>('')
  const [idDestino, setIdDestino] = useState<number | ''>('')
  const [cargando, setCargando] = useState(false)
  const [mensaje, setMensaje] = useState<{ texto: string; tipo: string } | null>(null)

  useEffect(() => {
    GestionAcademicaServicio.obtenerComisiones()
      .then(setComisiones)
      .catch(() => {})
  }, [])

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!idOrigen || !idDestino) return
    if (idOrigen === idDestino) {
      setMensaje({ texto: 'Las comisiones de origen y destino no pueden ser iguales.', tipo: 'error' })
      return
    }

    setCargando(true)
    setMensaje(null)
    try {
      await MatchingServicio.crearSolicitud(idOrigen, idDestino)
      setMensaje({ texto: 'Solicitud creada correctamente.', tipo: 'success' })
      setIdOrigen('')
      setIdDestino('')
      onSolicitudCreada()
    } catch (err: unknown) {
      setMensaje({ texto: err instanceof Error ? err.message : 'Error al crear solicitud', tipo: 'error' })
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-6">
      <h3 className="font-bold text-primary-unne text-lg mb-4">Nueva solicitud de intercambio</h3>
      <form onSubmit={enviar} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-zinc-400 uppercase">Comisión de origen (la que querés dejar)</label>
          <select
            value={idOrigen}
            onChange={(e) => setIdOrigen(Number(e.target.value))}
            required
            className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm bg-white cursor-pointer"
          >
            <option value="">Seleccioná una comisión</option>
            {comisiones.map((c) => (
              <option key={c.id_comision} value={c.id_comision}>{c.nombre_comision}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-zinc-400 uppercase">Comisión de destino (la que querés obtener)</label>
          <select
            value={idDestino}
            onChange={(e) => setIdDestino(Number(e.target.value))}
            required
            className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm bg-white cursor-pointer"
          >
            <option value="">Seleccioná una comisión</option>
            {comisiones.map((c) => (
              <option key={c.id_comision} value={c.id_comision}>{c.nombre_comision}</option>
            ))}
          </select>
        </div>

        {mensaje && (
          <div className={`p-4 rounded-xl text-sm font-bold border ${
            mensaje.tipo === 'error'
              ? 'bg-red-50 text-red-500 border-red-100'
              : 'bg-green-50 text-green-600 border-green-100'
          }`}>
            {mensaje.texto}
          </div>
        )}

        <button
          type="submit"
          disabled={cargando || !idOrigen || !idDestino}
          className="w-full bg-primary-unne text-white font-bold py-4 rounded-xl text-xs uppercase disabled:opacity-50"
        >
          {cargando ? 'Enviando...' : 'Crear solicitud'}
        </button>
      </form>
    </div>
  )
}
