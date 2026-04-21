"use client"
import { useState } from 'react'
import UserForm from '@/components/users/UserForm'
import UserList from '@/components/users/UserList'

export default function UsersPage() {
  const [refreshKey, setRefreshKey] = useState(0)
  const [userEditing, setUserEditing] = useState<any>(null)

  return (
    <div className="animate-in fade-in duration-700">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-primary-unne tracking-tighter uppercase">Directorio de Usuarios</h1>
        <p className="text-zinc-400 text-sm font-medium">Gestión académica y control de accesos.</p>
      </div>
      <div className="grid grid-cols-12 gap-10 items-start">
        <div className="col-span-12 xl:col-span-4 sticky top-28">
          <UserForm onUserCreated={() => setRefreshKey(prev => prev + 1)} userEditing={userEditing} onCancelEdit={() => setUserEditing(null)} />
        </div>
        <div className="col-span-12 xl:col-span-8">
          <UserList refreshKey={refreshKey} onEdit={(u: any) => setUserEditing(u)} />
        </div>
      </div>
    </div>
  )
}