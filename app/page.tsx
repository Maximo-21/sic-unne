"use client"
import { useState } from 'react'
import UserForm from '@/components/users/UserForm'
import UserList from '@/components/users/UserList'

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0)
  const [userEditing, setUserEditing] = useState<any>(null)

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* 1. Sidebar Administrativa (Fija a la izquierda) */}
      <aside className="w-72 bg-primary-unne hidden lg:flex flex-col text-white p-8">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center font-black">UNNE</div>
          <span className="font-headline font-bold text-xl tracking-tight">Panel Admin</span>
        </div>
        
        <nav className="flex-1 space-y-1">
          <div className="p-4 bg-white/10 rounded-2xl flex items-center gap-4 font-bold text-sm cursor-pointer border border-white/10">
            <span className="material-symbols-outlined">group</span> Usuarios
          </div>
          <div className="p-4 text-white/50 hover:bg-white/5 rounded-2xl flex items-center gap-4 font-medium text-sm transition-all cursor-pointer">
            <span className="material-symbols-outlined">analytics</span> Estadísticas
          </div>
          <div className="p-4 text-white/50 hover:bg-white/5 rounded-2xl flex items-center gap-4 font-medium text-sm transition-all cursor-pointer">
            <span className="material-symbols-outlined">settings</span> Configuración
          </div>
        </nav>

        <div className="pt-8 border-t border-white/10">
          <div className="bg-white/5 p-4 rounded-2xl">
            <p className="text-[10px] text-white/40 uppercase font-black tracking-widest mb-2">Sistema Actual</p>
            <p className="text-xs font-bold">SIC-UNNE v2.0</p>
          </div>
        </div>
      </aside>

      {/* 2. Contenido Principal */}
      <main className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-zinc-200 flex items-center justify-between px-10 sticky top-0 z-30">
          <div className="text-sm font-semibold text-zinc-400">
            Principal <span className="mx-2 text-zinc-300">/</span> <span className="text-primary-unne">Gestión de Usuarios</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="w-px h-8 bg-zinc-200"></div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs font-black text-primary-unne uppercase">Admin Rectorado</p>
                <p className="text-[10px] text-zinc-400 font-bold">Sesión Activa</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#f4f7fe] flex items-center justify-center border border-zinc-200">
                <span className="material-symbols-outlined text-primary-unne">account_circle</span>
              </div>
            </div>
          </div>
        </header>

        {/* Zona de Trabajo */}
        <div className="p-10">
          <div className="mb-10">
            <h1 className="text-3xl font-black text-primary-unne tracking-tighter uppercase">Directorio de Usuarios</h1>
            <p className="text-zinc-400 text-sm font-medium">Control y seguimiento de accesos al sistema académico.</p>
          </div>

          <div className="grid grid-cols-12 gap-10 items-start">
            {/* ⬅️ FORMULARIO A LA IZQUIERDA (4 de 12 col) */}
            <div className="col-span-12 xl:col-span-4 sticky top-28">
              <UserForm 
                onUserCreated={() => setRefreshKey(prev => prev + 1)}
                userEditing={userEditing}
                onCancelEdit={() => setUserEditing(null)}
              />
            </div>

            {/* ➡️ LISTA A LA DERECHA (8 de 12 col) */}
            <div className="col-span-12 xl:col-span-8">
              <UserList 
                refreshKey={refreshKey}
                onEdit={(u) => setUserEditing(u)}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}