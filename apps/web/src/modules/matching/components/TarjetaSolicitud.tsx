"use client"
import { useState } from 'react'
import { MatchingServicio } from '../services/MatchingServicio'
import { Solicitud } from '../types/Solicitud'
import EtiquetaEstado from '@shared/components/EtiquetaEstado'

interface Props {
  solicitud: Solicitud;
  onCancelada: () => void;
}

export default function TarjetaSolicitud({ solicitud, onCancelada }: Props) {
  const [cancelando, setCancelando] = useState(false)
  const [expandida, setExpandida] = useState(false)

  const cancelar = async () => {
    if (!confirm('¿Cancelar esta solicitud?')) return
    setCancelando(true)
    try {
      await MatchingServicio.cancelarSolicitud(solicitud.id_solicitud)
      onCancelada()
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error al cancelar')
    } finally {
      setCancelando(false)
    }
  }

  return (
    <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-sm space-y-4">
      <div className="flex justify-between items-start">
        <EtiquetaEstado estado={solicitud.estado} />
        <span className="text-[10px] text-zinc-400 font-mono">
          {solicitud.fecha_creacion ? new Date(solicitud.fecha_creacion).toLocaleDateString('es-AR') : '—'}
        </span>
      </div>

      <div className="space-y-3">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-zinc-400 uppercase">De</p>
          <p className="text-sm font-bold text-zinc-900">
            {solicitud.nombre_comision_origen ?? `Comisión #${solicitud.id_comision_origen}`}
          </p>
          {solicitud.nombre_asignatura_origen && (
            <p className="text-xs text-zinc-400">{solicitud.nombre_asignatura_origen}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="h-px flex-1 bg-zinc-100"></div>
          <span className="material-symbols-outlined text-zinc-300 text-base">arrow_downward</span>
          <div className="h-px flex-1 bg-zinc-100"></div>
        </div>

        <div className="space-y-1">
          <p className="text-[10px] font-black text-zinc-400 uppercase">A</p>
          <p className="text-sm font-bold text-zinc-900">
            {solicitud.nombre_comision_destino ?? `Comisión #${solicitud.id_comision_destino}`}
          </p>
        </div>
      </div>

      {expandida && (
        <div className="pt-2 border-t border-zinc-50 space-y-1.5 text-xs text-zinc-400">
          <p><span className="font-bold text-zinc-500">Alumno:</span> {solicitud.nombre_usuario} {solicitud.apellido_usuario}</p>
        </div>
      )}

      <div className="flex gap-2 pt-1">
        <button
          onClick={() => setExpandida(!expandida)}
          className="flex-1 border border-zinc-200 text-zinc-500 hover:text-zinc-700 font-bold py-2.5 rounded-xl text-xs uppercase hover:bg-zinc-50 transition-colors"
        >
          {expandida ? 'Ocultar' : 'Ver detalles'}
        </button>
        {solicitud.estado === 'pendiente' && (
          <button
            onClick={cancelar}
            disabled={cancelando}
            className="flex-1 border border-red-100 text-red-400 hover:text-red-600 hover:border-red-200 font-bold py-2.5 rounded-xl text-xs uppercase disabled:opacity-50 transition-colors"
          >
            {cancelando ? 'Cancelando...' : 'Cancelar'}
          </button>
        )}
      </div>
    </div>
  )
}
