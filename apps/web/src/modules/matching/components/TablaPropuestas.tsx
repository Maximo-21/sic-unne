"use client"
import { Propuesta } from '../types/Propuesta'
import EtiquetaEstado from '@shared/components/EtiquetaEstado'

interface Props {
  propuestas: Propuesta[];
  onVerDetalles: (propuesta: Propuesta) => void;
}

function nombreCompleto(sol: Propuesta['solicitud1']): string {
  if (!sol) return '—'
  return `${sol.nombre_usuario ?? ''} ${sol.apellido_usuario ?? ''}`.trim() || '—'
}

export default function TablaPropuestas({ propuestas, onVerDetalles }: Props) {
  if (propuestas.length === 0) {
    return (
      <div className="bg-white border border-zinc-200 rounded-2xl">
        <div className="px-8 py-10 text-center text-zinc-400 text-sm">
          No hay propuestas registradas.
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-zinc-50/50 text-[11px] font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-100">
            <th className="px-8 py-5">Alumno 1</th>
            <th className="px-8 py-5">Alumno 2</th>
            <th className="px-8 py-5">Estado</th>
            <th className="px-8 py-5">Fecha Match</th>
            <th className="px-8 py-5 text-right">Acción</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-50">
          {propuestas.map((p) => (
            <tr key={p.id_propuesta} className="hover:bg-zinc-50/40">
              <td className="px-8 py-5">
                <p className="font-bold text-sm text-zinc-900">{nombreCompleto(p.solicitud1)}</p>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {p.solicitud1?.nombre_comision_origen ?? '—'}
                  {p.solicitud1?.nombre_asignatura_origen
                    ? ` · ${p.solicitud1.nombre_asignatura_origen}`
                    : ''}
                </p>
              </td>
              <td className="px-8 py-5">
                <p className="font-bold text-sm text-zinc-900">{nombreCompleto(p.solicitud2)}</p>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {p.solicitud2?.nombre_comision_origen ?? '—'}
                  {p.solicitud2?.nombre_asignatura_origen
                    ? ` · ${p.solicitud2.nombre_asignatura_origen}`
                    : ''}
                </p>
              </td>
              <td className="px-8 py-5">
                <EtiquetaEstado estado={p.estado_general} />
              </td>
              <td className="px-8 py-5 text-sm text-zinc-400">
                {p.fecha_match ? new Date(p.fecha_match).toLocaleDateString('es-AR') : '—'}
              </td>
              <td className="px-8 py-5 text-right">
                <button
                  onClick={() => onVerDetalles(p)}
                  className="text-xs font-bold text-primary-unne hover:underline"
                >
                  Ver detalles
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
