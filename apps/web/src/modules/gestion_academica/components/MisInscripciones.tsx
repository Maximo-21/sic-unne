"use client"
import { useEffect, useState, useCallback } from 'react'
import { GestionAcademicaServicio } from '../services/GestionAcademicaServicio'
import { Inscripcion } from '../types/Inscripcion'
import EtiquetaEstado from '@shared/components/EtiquetaEstado'

interface Props {
  claveRecarga?: number;
  onSolicitarIntercambio?: (inscripcion: Inscripcion) => void;
}

export default function MisInscripciones({ claveRecarga = 0, onSolicitarIntercambio }: Props) {
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const cargar = useCallback(async () => {
    setCargando(true)
    setError(null)
    try {
      const datos = await GestionAcademicaServicio.obtenerMisInscripciones()
      setInscripciones(datos)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al cargar inscripciones')
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => { cargar() }, [claveRecarga, cargar])

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm">
      <div className="p-6 border-b border-zinc-100 flex justify-between items-center">
        <h2 className="font-bold text-zinc-900">Mis inscripciones</h2>
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
              <th className="px-8 py-5">Comisión</th>
              <th className="px-8 py-5">Asignatura</th>
              <th className="px-8 py-5">Fecha</th>
              <th className="px-8 py-5">Estado</th>
              {onSolicitarIntercambio && <th className="px-8 py-5 text-right">Acción</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {inscripciones.map((i) => (
              <tr key={i.id_inscripcion} className="hover:bg-zinc-50/40">
                <td className="px-8 py-5 font-bold text-sm text-zinc-900">{i.nombre_comision ?? '—'}</td>
                <td className="px-8 py-5 text-sm text-zinc-500">{i.nombre_asignatura ?? '—'}</td>
                <td className="px-8 py-5 text-sm text-zinc-400">
                  {i.fecha_inscripcion ? new Date(i.fecha_inscripcion).toLocaleDateString('es-AR') : '—'}
                </td>
                <td className="px-8 py-5">
                  <EtiquetaEstado estado={i.estado} />
                </td>
                {onSolicitarIntercambio && (
                  <td className="px-8 py-5 text-right">
                    {i.estado === 'activa' && (
                      <button
                        onClick={() => onSolicitarIntercambio(i)}
                        className="text-xs font-bold text-primary-unne hover:underline"
                      >
                        Solicitar intercambio
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
            {!cargando && inscripciones.length === 0 && !error && (
              <tr>
                <td colSpan={onSolicitarIntercambio ? 5 : 4} className="px-8 py-10 text-center text-zinc-400 text-sm">
                  No tenés inscripciones activas.
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
