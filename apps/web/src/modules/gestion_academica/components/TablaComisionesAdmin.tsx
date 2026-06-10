"use client"
import { useEffect, useState, useCallback } from 'react'
import { GestionAcademicaServicio } from '../services/GestionAcademicaServicio'
import { Comision } from '../types/Comision'
import { Asignatura } from '../types/Asignatura'
import { Horario } from '../types/Horario'

export default function TablaComisionesAdmin() {
  const [comisiones, setComisiones] = useState<Comision[]>([])
  const [asignaturas, setAsignaturas] = useState<Asignatura[]>([])
  const [horarios, setHorarios] = useState<Horario[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const cargar = useCallback(async () => {
    setCargando(true)
    setError(null)
    try {
      const [coms, asigs, hors] = await Promise.all([
        GestionAcademicaServicio.obtenerComisiones(),
        GestionAcademicaServicio.obtenerAsignaturas(),
        GestionAcademicaServicio.obtenerHorarios(),
      ])
      setComisiones(coms)
      setAsignaturas(asigs)
      setHorarios(hors)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al cargar datos')
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => { cargar() }, [cargar])

  const nombreAsignatura = (idAsignatura: number) =>
    asignaturas.find((a) => a.id_asignatura === idAsignatura)?.nombre_asignatura ?? '—'

  const horariosDeComision = (idComision: number) =>
    horarios.filter((h) => h.id_comision === idComision)

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm">
      <div className="p-6 border-b border-zinc-100 flex justify-between items-center">
        <h2 className="font-bold text-zinc-900">Comisiones registradas</h2>
        <button
          onClick={cargar}
          disabled={cargando}
          className="p-2 text-zinc-400 hover:text-primary-unne rounded-xl transition-all disabled:opacity-50"
        >
          <span className={`material-symbols-outlined ${cargando ? 'animate-spin' : ''}`}>sync</span>
        </button>
      </div>

      {error && <p className="p-6 text-sm text-red-500">{error}</p>}

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-zinc-50/50 text-[11px] font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-100">
              <th className="px-8 py-5">Asignatura</th>
              <th className="px-8 py-5">Comisión</th>
              <th className="px-8 py-5">Horarios</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {comisiones.map((c) => {
              const hors = horariosDeComision(c.id_comision)
              return (
                <tr key={c.id_comision} className="hover:bg-zinc-50/40">
                  <td className="px-8 py-5 text-sm text-zinc-500">{nombreAsignatura(c.id_asignatura)}</td>
                  <td className="px-8 py-5 font-bold text-sm text-zinc-900">{c.nombre_comision}</td>
                  <td className="px-8 py-5">
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
            {!cargando && comisiones.length === 0 && !error && (
              <tr>
                <td colSpan={3} className="px-8 py-10 text-center text-zinc-400 text-sm">
                  No hay comisiones registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {cargando && (
        <div className="flex justify-center p-8">
          <div className="animate-spin h-8 w-8 border-4 border-primary-unne border-t-transparent rounded-full"></div>
        </div>
      )}
    </div>
  )
}
