"use client"
import { useState } from 'react'
import MisInscripciones from '@/modules/gestion_academica/components/MisInscripciones'
import ModalNuevaSolicitud from '@/modules/matching/components/ModalNuevaSolicitud'
import { Inscripcion } from '@/modules/gestion_academica/types/Inscripcion'

export default function InscripcionesPage() {
  const [claveRecarga, setClaveRecarga] = useState(0)
  const [inscripcionParaSolicitud, setInscripcionParaSolicitud] = useState<Inscripcion | null>(null)

  return (
    <div className="animate-in fade-in duration-700 font-body space-y-8">
      <div className="mb-2">
        <h1 className="text-3xl font-black text-zinc-900 tracking-tighter uppercase">Mis Inscripciones</h1>
        <p className="text-zinc-400 text-sm font-medium">Tus comisiones activas. Podés solicitar un intercambio desde acá.</p>
      </div>

      <MisInscripciones
        claveRecarga={claveRecarga}
        onSolicitarIntercambio={setInscripcionParaSolicitud}
      />

      {inscripcionParaSolicitud && (
        <ModalNuevaSolicitud
          inscripcionOrigen={inscripcionParaSolicitud}
          onCreada={() => setClaveRecarga((k) => k + 1)}
          onCerrar={() => setInscripcionParaSolicitud(null)}
        />
      )}
    </div>
  )
}
