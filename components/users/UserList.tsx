"use client"

import { useEffect, useState } from 'react'
import { userService } from '@/services/userService'
import { User } from '@/types/user'

interface Props {
  refreshKey: number;
  onEdit: (u: User) => void;
}

export default function UserList({ refreshKey, onEdit }: Props) {
  const [users, setUsers] = useState<User[]>([])
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState<'nombre' | 'dni' | 'rol' | 'estado'>('nombre')
  const [loading, setLoading] = useState(true)

  // 1. Cargar usuarios (READ)
  const fetchUsersData = async () => {
    setLoading(true)
    const { data, error } = await userService.fetchUsers()
    if (!error && data) {
      setUsers(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchUsersData()
  }, [refreshKey])

  // 2. Refrescar todo (Opción de Reset)
  const handleRefresh = () => {
    setSearch('')
    setFilterType('nombre')
    fetchUsersData()
  }

  // 3. Baja/Alta Lógica (UPDATE status)
  const handleToggleStatus = async (user: User) => {
    const newStatus = user.estado === 'activo' ? 'inactivo' : 'activo'
    const confirmMsg = newStatus === 'inactivo' 
      ? '¿Confirm deactivation? The user will not participate in the matching.' 
      : '¿Reactivate user?'

    if (confirm(confirmMsg)) {
      const { error } = await userService.updateUser(user.id_usuario!, { estado: newStatus })
      if (!error) {
        fetchUsersData()
      } else {
        alert("Error updating status: " + error.message)
      }
    }
  }

  // 4. Lógica de filtrado inteligente
  const filteredUsers = users.filter(u => {
    const term = search.toLowerCase()
    if (filterType === 'nombre') return (u.nombre + " " + u.apellido).toLowerCase().includes(term)
    if (filterType === 'dni') return u.dni.includes(term)
    if (filterType === 'rol') return u.rol.toLowerCase().includes(term)
    if (filterType === 'estado') return u.estado.toLowerCase().includes(term)
    return true
  })

  return (
    <div className="bg-zinc-900/30 border border-zinc-800 rounded-[32px] overflow-hidden backdrop-blur-md shadow-2xl">
      
      {/* Search Bar & Filters */}
      <div className="p-6 border-b border-zinc-800 flex flex-col lg:flex-row justify-between items-center gap-4 bg-zinc-900/20">
        <div>
          <h3 className="text-lg font-black text-white uppercase tracking-tighter">User Management</h3>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">Database Records</p>
        </div>

        <div className="flex items-center gap-2 w-full lg:w-auto">
          {/* Selector de Criterio */}
          <select 
            value={filterType}
            onChange={(e: any) => setFilterType(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 text-white text-[10px] font-bold uppercase rounded-xl px-3 py-3 outline-none focus:border-yellow-400 transition-all cursor-pointer"
          >
            <option value="nombre">Name</option>
            <option value="dni">DNI</option>
            <option value="rol">Role</option>
            <option value="estado">Status</option>
          </select>

          {/* Input de Búsqueda */}
          <div className="relative flex-1 lg:w-64">
            <input 
              type="text"
              placeholder={`Search by ${filterType}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-black border border-zinc-700 rounded-xl py-3 px-5 text-sm text-white focus:border-yellow-400 outline-none transition-all placeholder:text-zinc-700"
            />
          </div>

          {/* Botón Refresh */}
          <button 
            onClick={handleRefresh}
            className="p-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl text-white transition-all active:scale-95"
            title="Refresh Table"
          >
            🔄
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-0">
          <thead className="bg-zinc-900/50 text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-black border-b border-zinc-800">
            <tr>
              <th className="px-8 py-5">User Profile</th>
              <th className="px-8 py-5">Status</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {filteredUsers.map((u) => (
              <tr 
                key={u.id_usuario} 
                className={`group transition-all duration-300 ${
                  u.estado === 'inactivo' ? 'bg-black/40 opacity-40 grayscale' : 'hover:bg-white/[0.02]'
                }`}
              >
                {/* User Info */}
                <td className="px-8 py-4">
                  <div className="font-bold text-sm text-white tracking-tight">
                    {u.nombre} {u.apellido}
                  </div>
                  <div className="text-zinc-500 text-[10px] font-mono mt-1 flex gap-2">
                    <span className="bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-400">{u.dni}</span>
                    <span className="bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-400 uppercase">{u.rol}</span>
                  </div>
                </td>

                {/* Status Indicator */}
                <td className="px-8 py-4">
                   <span className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${
                     u.estado === 'activo' ? 'text-yellow-400' : 'text-zinc-600'
                   }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${
                        u.estado === 'activo' ? 'bg-yellow-400 animate-pulse shadow-[0_0_8px_rgba(250,204,21,0.5)]' : 'bg-zinc-700'
                      }`}></span>
                      {u.estado}
                   </span>
                </td>

                {/* Actions */}
                <td className="px-8 py-4 text-right">
                  <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {u.estado === 'activo' && (
                      <button 
                        onClick={() => onEdit(u)}
                        className="text-[10px] font-black uppercase text-zinc-500 hover:text-white transition-colors"
                      >
                        Edit
                      </button>
                    )}
                    <button 
                      onClick={() => handleToggleStatus(u)}
                      className={`text-[10px] font-black uppercase transition-colors ${
                        u.estado === 'activo' ? 'text-zinc-700 hover:text-red-500' : 'text-yellow-500 hover:text-yellow-300'
                      }`}
                    >
                      {u.estado === 'activo' ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Loading & Empty States */}
      {loading && (
        <div className="p-16 text-center">
          <div className="inline-block h-5 w-5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.3em] mt-4">Syncing with server...</p>
        </div>
      )}

      {!loading && filteredUsers.length === 0 && (
        <div className="p-24 text-center border-t border-zinc-800/50">
          <p className="text-zinc-700 text-xs italic font-medium uppercase tracking-widest">No matching records found.</p>
          <button onClick={handleRefresh} className="mt-4 text-yellow-400 text-[10px] font-bold uppercase hover:underline">Clear all filters</button>
        </div>
      )}
    </div>
  )
}