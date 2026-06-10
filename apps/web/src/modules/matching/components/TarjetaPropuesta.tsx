"use client"
import { useState } from 'react'
import { MatchingServicio } from '../services/MatchingServicio'
import { Propuesta } from '../types/Propuesta'
import { obtenerIdUsuario } from '@shared/utils/sesion'
import EtiquetaEstado from '@shared/components/EtiquetaEstado'

interface Props {
  propuesta: Propuesta;
  onVotada: () => void;
}

export default function TarjetaPropuesta({ propuesta, onVotada }: Props) {
  const [votando, setVotando] = useState(false)

  const idUsuario = obtenerIdUsuario()
  const esMiSolicitud1 = propuesta.solicitud1?.id_usuario === idUsuario
  const miEstado = esMiSolicitud1 ? propuesta.estado_alumno_1 : propuesta.estado_alumno_2
  const puedeVotar = propuesta.estado_general === 'pendiente' && miEstado === 'pendiente'

  const votar = async (voto: 'aceptado' | 'rechazado') => {
    if (!confirm(`¿Confirmar voto: ${voto}?`)) return
    setVotando(true)
    try {
      await MatchingServicio.votarPropuesta(propuesta.id_propuesta, voto)
      onVotada()
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error al votar')
    } finally {
      setVotando(false)
    }
  }

  return (
    <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-sm space-y-5">
      <div className="flex justify-between items-center">
        <EtiquetaEstado estado={propuesta.estado_general} />
        {propuesta.fecha_match && (
          <span className="text-[10px] text-zinc-400 font-mono">
            {new Date(propuesta.fecha_match).toLocaleDateString('es-AR')}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-zinc-50 rounded-xl p-4 space-y-2">
          <p className="text-[10px] font-black text-zinc-400 uppercase">Alumno 1</p>
          <p className="font-bold text-sm text-zinc-900">
            {propuesta.solicitud1
              ? `${propuesta.solicitud1.nombre_usuario ?? ''} ${propuesta.solicitud1.apellido_usuario ?? ''}`.trim() || '—'
              : '—'}
          </p>
          <div className="space-y-0.5">
            <p className="text-[10px] text-zinc-400">
              <span className="font-bold">De:</span> {propuesta.solicitud1?.nombre_comision_origen ?? '—'}
            </p>
            <p className="text-[10px] text-zinc-400">
              <span className="font-bold">A:</span> {propuesta.solicitud1?.nombre_comision_destino ?? '—'}
            </p>
          </div>
          <EtiquetaEstado estado={propuesta.estado_alumno_1} />
        </div>

        <div className="bg-zinc-50 rounded-xl p-4 space-y-2">
          <p className="text-[10px] font-black text-zinc-400 uppercase">Alumno 2</p>
          <p className="font-bold text-sm text-zinc-900">
            {propuesta.solicitud2
              ? `${propuesta.solicitud2.nombre_usuario ?? ''} ${propuesta.solicitud2.apellido_usuario ?? ''}`.trim() || '—'
              : '—'}
          </p>
          <div className="space-y-0.5">
            <p className="text-[10px] text-zinc-400">
              <span className="font-bold">De:</span> {propuesta.solicitud2?.nombre_comision_origen ?? '—'}
            </p>
            <p className="text-[10px] text-zinc-400">
              <span className="font-bold">A:</span> {propuesta.solicitud2?.nombre_comision_destino ?? '—'}
            </p>
          </div>
          <EtiquetaEstado estado={propuesta.estado_alumno_2} />
        </div>
      </div>

      {puedeVotar && (
        <div className="flex gap-3 pt-1">
          <button
            onClick={() => votar('aceptado')}
            disabled={votando}
            className="flex-1 bg-primary-unne text-white font-bold py-4 rounded-xl text-sm uppercase disabled:opacity-50 hover:opacity-90 transition-all"
          >
            {votando ? '...' : 'Aceptar'}
          </button>
          <button
            onClick={() => votar('rechazado')}
            disabled={votando}
            className="flex-1 border border-red-100 text-red-500 hover:bg-red-50 font-bold py-4 rounded-xl text-sm uppercase disabled:opacity-50 transition-all"
          >
            {votando ? '...' : 'Rechazar'}
          </button>
        </div>
      )}
    </div>
  )
}
