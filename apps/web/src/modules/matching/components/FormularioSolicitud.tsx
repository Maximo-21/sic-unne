"use client"
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
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

  useEffect(() => {
    GestionAcademicaServicio.obtenerComisiones()
      .then(setComisiones)
      .catch(() => {})
  }, [])

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!idOrigen || !idDestino) return
    if (idOrigen === idDestino) {
      toast.error('Las comisiones de origen y destino no pueden ser iguales.')
      return
    }

    setCargando(true)
    try {
      const resultado = await MatchingServicio.crearSolicitud(idOrigen, idDestino)
      if (resultado.propuesta) {
        toast.success('¡Se encontró un match! Revisá tus propuestas para aceptar o rechazar.')
      } else {
        toast.success('Solicitud registrada. Aguardando una solicitud espejo.')
      }
      setIdOrigen('')
      setIdDestino('')
      onSolicitudCreada()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error al crear la solicitud')
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
