"use client"
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { MatchingServicio } from '../services/MatchingServicio'
import { GestionAcademicaServicio } from '@/modules/gestion_academica/services/GestionAcademicaServicio'
import { Inscripcion } from '@/modules/gestion_academica/types/Inscripcion'
import { Comision } from '@/modules/gestion_academica/types/Comision'

interface Props {
  inscripcionOrigen: Inscripcion;
  onCreada: () => void;
  onCerrar: () => void;
}

export default function ModalNuevaSolicitud({ inscripcionOrigen, onCreada, onCerrar }: Props) {
  const [comisiones, setComisiones] = useState<Comision[]>([])
  const [idDestino, setIdDestino] = useState<number | ''>('')
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    GestionAcademicaServicio.obtenerComisiones()
      .then(setComisiones)
      .catch(() => {})
  }, [])

  const comisionesDestino = comisiones.filter((c) => c.id_comision !== inscripcionOrigen.id_comision)

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!idDestino) return
    setCargando(true)
    try {
      const resultado = await MatchingServicio.crearSolicitud(inscripcionOrigen.id_comision, idDestino)
      if (resultado.propuesta) {
        toast.success('¡Match automático encontrado! Revisá tus propuestas.')
      } else {
        toast.success('Solicitud registrada. Aguardando solicitud espejo.')
      }
      onCreada()
      onCerrar()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error al crear la solicitud')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onCerrar}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-5" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center">
          <h2 className="font-black text-zinc-900 text-lg uppercase tracking-tighter">Nueva Solicitud</h2>
          <button onClick={onCerrar} className="text-zinc-400 hover:text-zinc-600 transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-4 space-y-1">
          <p className="text-[10px] font-black text-zinc-400 uppercase">Comisión de origen (la que vas a dejar)</p>
          <p className="font-bold text-zinc-900">{inscripcionOrigen.nombre_comision ?? `Comisión #${inscripcionOrigen.id_comision}`}</p>
          {inscripcionOrigen.nombre_asignatura && (
            <p className="text-xs text-zinc-400">{inscripcionOrigen.nombre_asignatura}</p>
          )}
        </div>

        <form onSubmit={enviar} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-zinc-400 uppercase">
              Comisión de destino (la que querés obtener)
            </label>
            <select
              value={idDestino}
              onChange={(e) => setIdDestino(Number(e.target.value))}
              required
              className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm bg-white cursor-pointer focus:border-primary-unne outline-none"
            >
              <option value="">Seleccioná una comisión</option>
              {comisionesDestino.map((c) => (
                <option key={c.id_comision} value={c.id_comision}>{c.nombre_comision}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onCerrar}
              className="flex-1 border border-zinc-200 text-zinc-500 font-bold py-3.5 rounded-xl text-xs uppercase hover:bg-zinc-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={cargando || !idDestino}
              className="flex-1 bg-primary-unne text-white font-bold py-3.5 rounded-xl text-xs uppercase disabled:opacity-50 hover:opacity-90 transition-all"
            >
              {cargando ? 'Creando...' : 'Crear solicitud'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
