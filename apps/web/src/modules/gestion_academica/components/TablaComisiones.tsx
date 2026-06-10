"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { GestionAcademicaServicio } from '../services/GestionAcademicaServicio'
import { Comision } from '../types/Comision'
import { Asignatura } from '../types/Asignatura'
import { Horario } from '../types/Horario'

export default function TablaComisiones() {
  const router = useRouter()
  const [comisiones, setComisiones] = useState<Comision[]>([])
  const [asignaturas, setAsignaturas] = useState<Asignatura[]>([])
  const [horarios, setHorarios] = useState<Horario[]>([])
  const [filtroAsignatura, setFiltroAsignatura] = useState<number | undefined>()
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [inscribiendo, setInscribiendo] = useState<number | null>(null)

  useEffect(() => {
    Promise.all([
      GestionAcademicaServicio.obtenerAsignaturas(),
      GestionAcademicaServicio.obtenerHorarios(),
    ])
      .then(([asigs, hors]) => {
        setAsignaturas(asigs)
        setHorarios(hors)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    setCargando(true)
    setError(null)
    GestionAcademicaServicio.obtenerComisiones(filtroAsignatura)
      .then(setComisiones)
      .catch((err: Error) => setError(err.message))
      .finally(() => setCargando(false))
  }, [filtroAsignatura])

  const nombreAsignatura = (idAsignatura: number) =>
    asignaturas.find((a) => a.id_asignatura === idAsignatura)?.nombre_asignatura ?? '—'

  const horariosDeComision = (idComision: number) =>
    horarios.filter((h) => h.id_comision === idComision)

  const inscribirse = async (idComision: number) => {
    if (!confirm('¿Inscribirse en esta comisión?')) return
    setInscribiendo(idComision)
    try {
      await GestionAcademicaServicio.inscribirse(idComision)
      router.push('/student/inscripciones')
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error al inscribirse')
      setInscribiendo(null)
    }
  }

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm">
      <div className="p-6 border-b border-zinc-100 flex justify-between items-center">
        <h2 className="font-bold text-zinc-900">Comisiones disponibles</h2>
        <select
          value={filtroAsignatura ?? ''}
          onChange={(e) => setFiltroAsignatura(e.target.value ? Number(e.target.value) : undefined)}
          className="border border-zinc-200 rounded-xl px-3 py-2 text-sm bg-white cursor-pointer focus:border-primary-unne outline-none"
        >
          <option value="">Todas las asignaturas</option>
          {asignaturas.map((a) => (
            <option key={a.id_asignatura} value={a.id_asignatura}>
              {a.nombre_asignatura}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="p-6 text-sm text-red-500">{error}</p>}

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-zinc-50/50 text-[11px] font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-100">
              <th className="px-8 py-5">Comisión</th>
              <th className="px-8 py-5">Asignatura</th>
              <th className="px-8 py-5">Horarios</th>
              <th className="px-8 py-5 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {comisiones.map((c) => {
              const hors = horariosDeComision(c.id_comision)
              return (
                <tr key={c.id_comision} className="hover:bg-zinc-50/40">
                  <td className="px-8 py-5 font-bold text-sm text-zinc-900">{c.nombre_comision}</td>
                  <td className="px-8 py-5 text-sm text-zinc-500">{nombreAsignatura(c.id_asignatura)}</td>
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
                  <td className="px-8 py-5 text-right">
                    <button
                      onClick={() => inscribirse(c.id_comision)}
                      disabled={inscribiendo === c.id_comision}
                      className="bg-primary-unne text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:opacity-90 disabled:opacity-50 transition-all"
                    >
                      {inscribiendo === c.id_comision ? 'Inscribiendo...' : 'Inscribirse'}
                    </button>
                  </td>
                </tr>
              )
            })}
            {!cargando && comisiones.length === 0 && !error && (
              <tr>
                <td colSpan={4} className="px-8 py-10 text-center text-zinc-400 text-sm">
                  No hay comisiones disponibles.
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
