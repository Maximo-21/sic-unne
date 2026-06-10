"use client"
import TarjetaSolicitud from './TarjetaSolicitud'
import { Solicitud } from '../types/Solicitud'

interface Props {
  solicitudes: Solicitud[];
  onCancelada: () => void;
}

export default function ListaSolicitudes({ solicitudes, onCancelada }: Props) {
  if (solicitudes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <span className="material-symbols-outlined text-5xl text-zinc-200 mb-3">swap_horiz</span>
        <p className="text-sm font-bold text-zinc-400">No tenés solicitudes activas.</p>
        <p className="text-xs text-zinc-300 mt-1">Podés crear una desde la página de <span className="text-primary-unne">Inscripciones</span>.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {solicitudes.map((s) => (
        <TarjetaSolicitud key={s.id_solicitud} solicitud={s} onCancelada={onCancelada} />
      ))}
    </div>
  )
}
