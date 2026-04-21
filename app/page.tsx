"use client"

import { useState } from 'react'
import UserForm from '@/components/users/UserForm'
import UserList from '@/components/users/UserList'
import { User } from '@/types/user'

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0)
  
  // 💡 ESTADO CLAVE: Aquí guardamos al usuario que seleccionamos para editar
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  // Función que se dispara cuando creamos o editamos con éxito
  const handleUserAction = () => {
    setRefreshKey(prev => prev + 1) // Refresca la lista
    setSelectedUser(null)          // Limpia el formulario (vuelve a modo "Crear")
  }

  return (
    <main className="min-h-screen bg-black text-zinc-100 p-6 lg:p-10">
      {/* Header del Sistema */}
      <header className="mb-10 flex justify-between items-end border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter">
            SIC<span className="text-yellow-400">.</span>UNNE
          </h1>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.4em]">
            Matching Engine <span className="text-zinc-700">v1.0</span>
          </p>
        </div>
      </header>

      {/* Grid Principal: 4 columnas para Form, 8 para Lista */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Lado Izquierdo: Formulario de Usuario */}
        <section className="lg:col-span-4 sticky top-10">
          <UserForm 
            onUserCreated={handleUserAction} 
            userEditing={selectedUser} 
            onCancelEdit={() => setSelectedUser(null)} 
          />
        </section>

        {/* Lado Derecho: Listado de Usuarios */}
        <section className="lg:col-span-8">
          <UserList 
            refreshKey={refreshKey} 
            onEdit={setSelectedUser} 
          />
        </section>

      </div>
    </main>
  )
}