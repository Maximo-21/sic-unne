"use client"
import { useState } from 'react'
import UserForm from '@/components/users/UserForm'
import UserList from '@/components/users/UserList'

export default function UsersPage() {
  // 1. Renombramos los estados para el diagrama
  const [claveRecarga, setClaveRecarga] = useState(0)
  const [usuarioEditando, setUsuarioEditando] = useState<any>(null)

  // 2. Función para disparar la actualización de la lista
  const refrescarLista = () => setClaveRecarga(prev => prev + 1)

  return (
    <div className="animate-in fade-in duration-700">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-primary-unne tracking-tighter uppercase">Directorio de Usuarios</h1>
        <p className="text-zinc-400 text-sm font-medium">Gestión académica y control de accesos.</p>
      </div>

      <div className="grid grid-cols-12 gap-10 items-start">
        {/* COLUMNA DEL FORMULARIO */}
        <div className="col-span-12 xl:col-span-4 sticky top-28">
          <UserForm 
            alCrearUsuario={refrescarLista} 
            usuarioEditando={usuarioEditando} 
            alCancelarEdicion={() => setUsuarioEditando(null)} 
          />
        </div>

        {/* COLUMNA DE LA LISTA */}
        <div className="col-span-12 xl:col-span-8">
          <UserList 
            claveRecarga={claveRecarga} 
            alEditar={(u: any) => setUsuarioEditando(u)} 
          />
        </div>
      </div>
    </div>
  )
}