"use client"
import { useEffect, useState, useCallback } from 'react'
import TablaAsignaturas from '@/modules/gestion_academica/components/TablaAsignaturas'
import ModalComisionesAsignatura from '@/modules/gestion_academica/components/ModalComisionesAsignatura'
import { GestionAcademicaServicio } from '@/modules/gestion_academica/services/GestionAcademicaServicio'
import { Asignatura } from '@/modules/gestion_academica/types/Asignatura'

export default function CareersPage() {
  const [asignaturas, setAsignaturas] = useState<Asignatura[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [asignaturaSeleccionada, setAsignaturaSeleccionada] = useState<Asignatura | null>(null)

  const cargar = useCallback(async () => {
    setCargando(true)
    setError(null)
    try {
      const datos = await GestionAcademicaServicio.obtenerAsignaturas()
      setAsignaturas(datos)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al cargar asignaturas')
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => { cargar() }, [cargar])

  return (
    <div className="animate-in fade-in duration-700 font-body">
      <div className="mb-10 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 tracking-tighter uppercase">Asignaturas</h1>
          <p className="text-zinc-400 text-sm font-medium">Materias registradas en la Facultad de Exactas.</p>
        </div>
        <button
          onClick={cargar}
          disabled={cargando}
          className="p-2.5 text-zinc-400 hover:text-primary-unne rounded-xl transition-all disabled:opacity-50"
        >
          <span className={`material-symbols-outlined ${cargando ? 'animate-spin' : ''}`}>sync</span>
        </button>
      </div>

      {error && <p className="mb-6 text-sm text-red-500">{error}</p>}

      {cargando ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin h-8 w-8 border-4 border-primary-unne border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <TablaAsignaturas
          asignaturas={asignaturas}
          onVerComisiones={setAsignaturaSeleccionada}
        />
      )}

      {asignaturaSeleccionada && (
        <ModalComisionesAsignatura
          idAsignatura={asignaturaSeleccionada.id_asignatura}
          nombreAsignatura={asignaturaSeleccionada.nombre_asignatura}
          onCerrar={() => setAsignaturaSeleccionada(null)}
        />
      )}
    </div>
  )
}
