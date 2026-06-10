"use client"
import { useEffect, useState, useCallback } from 'react'
import TablaPropuestas from '@/modules/matching/components/TablaPropuestas'
import ModalDetallesPropuesta from '@/modules/matching/components/ModalDetallesPropuesta'
import { MatchingServicio } from '@/modules/matching/services/MatchingServicio'
import { Propuesta } from '@/modules/matching/types/Propuesta'

export default function AdminSolicitudesPage() {
  const [propuestas, setPropuestas] = useState<Propuesta[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [propuestaDetalle, setPropuestaDetalle] = useState<Propuesta | null>(null)

  const cargar = useCallback(async () => {
    setCargando(true)
    setError(null)
    try {
      const datos = await MatchingServicio.obtenerTodasPropuestas()
      setPropuestas(datos)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al cargar propuestas')
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => { cargar() }, [cargar])

  return (
    <div className="animate-in fade-in duration-700 font-body">
      <div className="mb-10 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 tracking-tighter uppercase">
            Propuestas de Intercambio
          </h1>
          <p className="text-zinc-400 text-sm font-medium">Vista global de todos los intercambios del sistema.</p>
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
        <TablaPropuestas propuestas={propuestas} onVerDetalles={setPropuestaDetalle} />
      )}

      {propuestaDetalle && (
        <ModalDetallesPropuesta
          propuesta={propuestaDetalle}
          onCerrar={() => setPropuestaDetalle(null)}
        />
      )}
    </div>
  )
}
