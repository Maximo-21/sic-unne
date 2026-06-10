"use client"
import { useState } from 'react'
import { GestionAcademicaServicio } from '../services/GestionAcademicaServicio'
import { Comision } from '../types/Comision'

interface Props {
  comisionSeleccionada: Comision | null;
  onInscripcionExitosa: () => void;
  onCancelar: () => void;
}

export default function FormularioInscripcion({ comisionSeleccionada, onInscripcionExitosa, onCancelar }: Props) {
  const [cargando, setCargando] = useState(false)
  const [mensaje, setMensaje] = useState<{ texto: string; tipo: string } | null>(null)

  if (!comisionSeleccionada) return null;

  const confirmarInscripcion = async () => {
    setCargando(true)
    setMensaje(null)
    try {
      await GestionAcademicaServicio.inscribirse(comisionSeleccionada.id_comision)
      setMensaje({ texto: 'Inscripción realizada exitosamente.', tipo: 'success' })
      onInscripcionExitosa()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al inscribirse'
      setMensaje({ texto: msg, tipo: 'error' })
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-6 space-y-4">
      <h3 className="font-bold text-primary-unne text-lg">Confirmar Inscripción</h3>
      <p className="text-sm text-zinc-600">
        ¿Deseas inscribirte en <span className="font-bold text-zinc-900">{comisionSeleccionada.nombre_comision}</span>?
      </p>

      {mensaje && (
        <div className={`p-4 rounded-xl text-sm font-bold border ${
          mensaje.tipo === 'error'
            ? 'bg-red-50 text-red-500 border-red-100'
            : 'bg-green-50 text-green-600 border-green-100'
        }`}>
          {mensaje.texto}
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={confirmarInscripcion}
          disabled={cargando}
          className="flex-1 bg-primary-unne text-white font-bold py-3 rounded-xl text-sm disabled:opacity-50"
        >
          {cargando ? 'Procesando...' : 'Confirmar'}
        </button>
        <button
          onClick={onCancelar}
          className="flex-1 border border-zinc-200 text-zinc-500 font-bold py-3 rounded-xl text-sm hover:bg-zinc-50"
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}
