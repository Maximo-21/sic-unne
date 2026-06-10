"use client"
import { Asignatura } from '../types/Asignatura'

interface Props {
  asignaturas: Asignatura[];
  onVerComisiones: (asignatura: Asignatura) => void;
}

export default function TablaAsignaturas({ asignaturas, onVerComisiones }: Props) {
  return (
    <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-zinc-50/50 text-[11px] font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-100">
            <th className="px-8 py-5">Asignatura</th>
            <th className="px-8 py-5">Año</th>
            <th className="px-8 py-5 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-50">
          {asignaturas.map((a) => (
            <tr key={a.id_asignatura} className="hover:bg-zinc-50/40">
              <td className="px-8 py-5 font-bold text-sm text-zinc-900">{a.nombre_asignatura}</td>
              <td className="px-8 py-5">
                {a.anio_asignatura ? (
                  <span className="px-2.5 py-1 bg-primary-unne/5 text-primary-unne text-[10px] font-black uppercase rounded-lg">
                    {a.anio_asignatura}° año
                  </span>
                ) : (
                  <span className="text-zinc-300 text-sm">—</span>
                )}
              </td>
              <td className="px-8 py-5 text-right">
                <button
                  onClick={() => onVerComisiones(a)}
                  className="text-xs font-bold text-primary-unne hover:underline"
                >
                  Ver comisiones
                </button>
              </td>
            </tr>
          ))}
          {asignaturas.length === 0 && (
            <tr>
              <td colSpan={3} className="px-8 py-10 text-center text-zinc-400 text-sm">
                No hay asignaturas registradas.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
