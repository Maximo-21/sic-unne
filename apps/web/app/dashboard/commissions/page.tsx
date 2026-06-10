"use client"
import TablaComisionesAdmin from '@/modules/gestion_academica/components/TablaComisionesAdmin'

export default function CommissionsPage() {
  return (
    <div className="animate-in fade-in duration-700 font-body">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-zinc-900 tracking-tighter uppercase">Todas las Comisiones</h1>
        <p className="text-zinc-400 text-sm font-medium">Oferta académica completa con horarios por comisión.</p>
      </div>
      <TablaComisionesAdmin />
    </div>
  )
}
