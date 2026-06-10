"use client"
import { Propuesta } from '../types/Propuesta'
import EtiquetaEstado from '@shared/components/EtiquetaEstado'

interface Props {
  propuesta: Propuesta;
  onCerrar: () => void;
}

export default function ModalDetallesPropuesta({ propuesta, onCerrar }: Props) {
  const alumno = (sol: Propuesta['solicitud1'], estadoVoto: string) => (
    <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-5 space-y-3">
      <p className="font-bold text-zinc-900">
        {sol
          ? `${sol.nombre_usuario ?? ''} ${sol.apellido_usuario ?? ''}`.trim() || '—'
          : '—'}
      </p>
      <div className="space-y-1 text-xs text-zinc-500">
        <p>
          <span className="font-bold text-zinc-400">De: </span>
          {sol?.nombre_comision_origen ?? '—'}
        </p>
        <p>
          <span className="font-bold text-zinc-400">A: </span>
          {sol?.nombre_comision_destino ?? '—'}
        </p>
        {sol?.nombre_asignatura_origen && (
          <p>
            <span className="font-bold text-zinc-400">Asignatura: </span>
            {sol.nombre_asignatura_origen}
          </p>
        )}
      </div>
      <div>
        <p className="text-[10px] text-zinc-400 uppercase font-black mb-1.5">Voto</p>
        <EtiquetaEstado estado={estadoVoto} />
      </div>
    </div>
  )

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={onCerrar}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <h2 className="font-black text-zinc-900 text-lg uppercase tracking-tighter">
              Propuesta de Intercambio
            </h2>
            <EtiquetaEstado estado={propuesta.estado_general} />
          </div>
          <button
            onClick={onCerrar}
            className="text-zinc-400 hover:text-zinc-600 transition-colors ml-4"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {propuesta.fecha_match && (
          <p className="text-xs text-zinc-400">
            Fecha de match:{' '}
            <span className="font-bold text-zinc-600">
              {new Date(propuesta.fecha_match).toLocaleDateString('es-AR')}
            </span>
          </p>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-[10px] font-black text-zinc-400 uppercase">Alumno 1</p>
            {alumno(propuesta.solicitud1, propuesta.estado_alumno_1)}
          </div>
          <div className="space-y-2">
            <p className="text-[10px] font-black text-zinc-400 uppercase">Alumno 2</p>
            {alumno(propuesta.solicitud2, propuesta.estado_alumno_2)}
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button
            onClick={onCerrar}
            className="border border-zinc-200 text-zinc-500 font-bold py-2.5 px-6 rounded-xl text-xs uppercase hover:bg-zinc-50 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
