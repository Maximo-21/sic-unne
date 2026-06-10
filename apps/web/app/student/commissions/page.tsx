"use client"
import TablaComisiones from '@/modules/gestion_academica/components/TablaComisiones'

export default function StudentCommissionsPage() {
  return (
    <div className="animate-in fade-in duration-700 font-body">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-zinc-900 tracking-tighter uppercase">Comisiones Disponibles</h1>
        <p className="text-zinc-400 text-sm font-medium">Consultá la oferta horaria e inscribite en una comisión.</p>
      </div>
      <TablaComisiones />
    </div>
  )
}
