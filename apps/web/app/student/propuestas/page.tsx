"use client"
import { useEffect, useState, useCallback } from 'react'
import TarjetaPropuesta from '@/modules/matching/components/TarjetaPropuesta'
import { MatchingServicio } from '@/modules/matching/services/MatchingServicio'
import { Propuesta } from '@/modules/matching/types/Propuesta'

export default function PropuestasPage() {
  const [propuestas, setPropuestas] = useState<Propuesta[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const cargar = useCallback(async () => {
    setCargando(true)
    setError(null)
    try {
      const datos = await MatchingServicio.obtenerMisPropuestas()
      setPropuestas(datos)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al cargar propuestas')
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => { cargar() }, [cargar])

  return (
    <div className="animate-in fade-in duration-700 font-body space-y-8">
      <div className="mb-2">
        <h1 className="text-3xl font-black text-zinc-900 tracking-tighter uppercase">Mis Propuestas</h1>
        <p className="text-zinc-400 text-sm font-medium">Revisá y votá las propuestas de intercambio que te involucran.</p>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {cargando ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin h-8 w-8 border-4 border-primary-unne border-t-transparent rounded-full"></div>
        </div>
      ) : propuestas.length === 0 ? (
        <p className="text-sm text-zinc-400">No tenés propuestas de intercambio.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {propuestas.map((p) => (
            <TarjetaPropuesta key={p.id_propuesta} propuesta={p} onVotada={cargar} />
          ))}
        </div>
      )}
    </div>
  )
}
