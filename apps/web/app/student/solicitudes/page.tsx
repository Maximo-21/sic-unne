"use client"
import { useEffect, useState, useCallback } from 'react'
import ListaSolicitudes from '@/modules/matching/components/ListaSolicitudes'
import { MatchingServicio } from '@/modules/matching/services/MatchingServicio'
import { Solicitud } from '@/modules/matching/types/Solicitud'

export default function SolicitudesPage() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const cargar = useCallback(async () => {
    setCargando(true)
    setError(null)
    try {
      const datos = await MatchingServicio.obtenerMisSolicitudes()
      setSolicitudes(datos)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al cargar solicitudes')
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => { cargar() }, [cargar])

  return (
    <div className="animate-in fade-in duration-700 font-body space-y-8">
      <div className="mb-2">
        <h1 className="text-3xl font-black text-zinc-900 tracking-tighter uppercase">Mis Solicitudes</h1>
        <p className="text-zinc-400 text-sm font-medium">Seguimiento de tus solicitudes de intercambio de comisión.</p>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {cargando ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin h-8 w-8 border-4 border-primary-unne border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <ListaSolicitudes solicitudes={solicitudes} onCancelada={cargar} />
      )}
    </div>
  )
}
