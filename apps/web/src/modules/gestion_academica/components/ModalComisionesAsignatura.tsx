"use client"
import { useEffect, useState } from 'react'
import { GestionAcademicaServicio } from '../services/GestionAcademicaServicio'
import { Comision } from '../types/Comision'
import { Horario } from '../types/Horario'

interface Props {
  idAsignatura: number;
  nombreAsignatura: string;
  onCerrar: () => void;
}

export default function ModalComisionesAsignatura({ idAsignatura, nombreAsignatura, onCerrar }: Props) {
  const [comisiones, setComisiones] = useState<Comision[]>([])
  const [horarios, setHorarios] = useState<Horario[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    Promise.all([
      GestionAcademicaServicio.obtenerComisiones(idAsignatura),
      GestionAcademicaServicio.obtenerHorarios(),
    ])
      .then(([coms, hors]) => {
        setComisiones(coms)
        setHorarios(hors)
      })
      .catch(() => {})
      .finally(() => setCargando(false))
  }, [idAsignatura])

  const horariosDeComision = (idComision: number) =>
    horarios.filter((h) => h.id_comision === idComision)

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
          <div>
            <p className="text-[10px] font-black text-zinc-400 uppercase mb-0.5">Comisiones de</p>
            <h2 className="font-black text-zinc-900 text-lg tracking-tighter leading-tight">
              {nombreAsignatura}
            </h2>
          </div>
          <button
            onClick={onCerrar}
            className="text-zinc-400 hover:text-zinc-600 transition-colors ml-4"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {cargando ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary-unne border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-zinc-50/50 text-[11px] font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-100">
                  <th className="px-6 py-4">Comisión</th>
                  <th className="px-6 py-4">Horarios</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {comisiones.map((c) => {
                  const hors = horariosDeComision(c.id_comision)
                  return (
                    <tr key={c.id_comision} className="hover:bg-zinc-50/40">
                      <td className="px-6 py-4 font-bold text-sm text-zinc-900">{c.nombre_comision}</td>
                      <td className="px-6 py-4">
                        {hors.length === 0 ? (
                          <span className="text-zinc-300 text-sm">—</span>
                        ) : (
                          <div className="space-y-0.5">
                            {hors.map((h) => (
                              <div key={h.id_horario} className="text-xs text-zinc-400">
                                <span className="font-bold text-zinc-600 capitalize">{h.dia}</span>
                                {' '}{h.hora_desde}–{h.hora_hasta}
                                {' '}<span className="text-zinc-300">({h.modalidad})</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })}
                {comisiones.length === 0 && (
                  <tr>
                    <td colSpan={2} className="px-6 py-8 text-center text-zinc-400 text-sm">
                      No hay comisiones para esta asignatura.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

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
