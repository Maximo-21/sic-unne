"use client"
import { useEffect, useState, useCallback } from 'react'
import { userService } from '@/services/userService'
import { User } from '@/types/user'

interface Props {
  refreshKey: number;
  onEdit: (u: User) => void;
}

export default function UserList({ refreshKey, onEdit }: Props) {
  const [users, setUsers] = useState<User[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  // 🔄 Función para traer datos (memorizada para evitar bucles)
  const fetchUsersData = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await userService.fetchUsers()
      if (error) throw error
      if (data) setUsers(data)
    } catch (err: any) {
      console.error("Error fetching users:", err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Escuchar cambios externos (cuando el form crea/edita)
  useEffect(() => { 
    fetchUsersData() 
  }, [refreshKey, fetchUsersData])

  // 🛡️ Lógica de Alta/Baja corregida
  const handleToggleStatus = async (user: User) => {
    const newStatus = user.estado === 'activo' ? 'inactivo' : 'activo'
    const accion = newStatus === 'activo' ? 'ACTIVAR' : 'DESACTIVAR'

    if (confirm(`¿Está seguro que desea ${accion} al usuario ${user.nombre}?`)) {
      setLoading(true) // Bloqueamos visualmente para evitar clics dobles
      try {
        const { error } = await userService.updateUser(user.id_usuario!, { estado: newStatus })
        if (error) throw error
        
        // 💡 Truco: Esperamos un suspiro para que la DB asiente el cambio antes de pedir la lista
        await fetchUsersData()
      } catch (err: any) {
        alert("No se pudo cambiar el estado: " + err.message)
        setLoading(false)
      }
    }
  }

  // Filtro inteligente (Nombre + Apellido + DNI)
  const filteredUsers = users.filter(u => 
    `${u.nombre} ${u.apellido} ${u.dni}`.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm min-h-[500px] flex flex-col">
      {/* Header con Buscador */}
      <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-white sticky top-0 z-10 rounded-t-2xl">
        <div className="relative w-full max-w-md">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 text-lg">search</span>
          <input 
            type="text" 
            placeholder="Buscar por nombre, DNI o cargo..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:bg-white focus:border-primary-unne outline-none transition-all placeholder:text-zinc-400"
          />
        </div>
        
        <button 
          onClick={fetchUsersData} 
          disabled={loading}
          className="ml-4 p-2.5 text-zinc-400 hover:text-primary-unne hover:bg-primary-unne/5 rounded-xl transition-all disabled:opacity-50"
          title="Sincronizar ahora"
        >
          <span className={`material-symbols-outlined ${loading ? 'animate-spin' : ''}`}>sync</span>
        </button>
      </div>

      {/* Tabla de Datos */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50/50 text-[11px] font-bold text-zinc-400 uppercase tracking-[0.15em] border-b border-zinc-100">
              <th className="px-8 py-5">Identidad del Miembro</th>
              <th className="px-8 py-5">Estado</th>
              <th className="px-8 py-5 text-right">Gestión</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((u) => (
                <tr key={u.id_usuario} className={`group hover:bg-zinc-50/40 transition-colors ${u.estado === 'inactivo' ? 'bg-zinc-50/20' : ''}`}>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      {/* Avatar minimalista */}
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold text-xs shadow-sm ${
                        u.estado === 'activo' ? 'bg-primary-unne text-white' : 'bg-zinc-200 text-zinc-500'
                      }`}>
                        {u.nombre[0]}{u.apellido[0]}
                      </div>
                      <div>
                        <p className={`font-bold text-sm tracking-tight ${u.estado === 'inactivo' ? 'text-zinc-400' : 'text-zinc-900'}`}>
                          {u.nombre} {u.apellido}
                        </p>
                        <div className="flex gap-2 items-center mt-0.5">
                            <span className="text-[10px] font-mono text-zinc-400">{u.dni}</span>
                            <span className="w-1 h-1 bg-zinc-200 rounded-full"></span>
                            <span className="text-[9px] font-black uppercase text-primary-unne/60">{u.rol}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter border ${
                      u.estado === 'activo' 
                        ? 'bg-green-50 text-green-700 border-green-100' 
                        : 'bg-zinc-100 text-zinc-500 border-zinc-200'
                    }`}>
                      <span className={`h-1 w-1 rounded-full mr-1.5 ${u.estado === 'activo' ? 'bg-green-500' : 'bg-zinc-400'}`}></span>
                      {u.estado}
                    </span>
                  </td>

                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-1 md:opacity-0 group-hover:opacity-100 transition-all">
                      <button 
                        onClick={() => onEdit(u)} 
                        className="p-2 text-zinc-400 hover:text-primary-unne hover:bg-primary-unne/5 rounded-lg transition-colors" 
                        title="Editar perfil"
                      >
                        <span className="material-symbols-outlined text-xl">edit_note</span>
                      </button>
                      
                      <button 
                        onClick={() => handleToggleStatus(u)} 
                        className={`p-2 rounded-lg transition-colors ${
                          u.estado === 'activo' ? 'text-zinc-300 hover:text-red-500 hover:bg-red-50' : 'text-primary-unne hover:bg-primary-unne/5'
                        }`} 
                        title={u.estado === 'activo' ? 'Desactivar' : 'Reactivar'}
                      >
                        <span className="material-symbols-outlined text-xl">
                          {u.estado === 'activo' ? 'person_off' : 'how_to_reg'}
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : !loading && (
              <tr>
                <td colSpan={3} className="py-20 text-center">
                  <span className="material-symbols-outlined text-4xl text-zinc-200">person_search</span>
                  <p className="text-zinc-400 text-xs font-bold uppercase mt-2">No se encontraron resultados</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Footer informativo */}
      <div className="p-4 border-t border-zinc-50 bg-zinc-50/30 text-[9px] text-zinc-400 font-bold uppercase tracking-widest flex justify-between">
        <span>Total: {filteredUsers.length} Usuarios</span>
        <span>SIC-UNNE Database</span>
      </div>

      {loading && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center rounded-2xl z-20">
          <div className="flex flex-col items-center">
            <div className="h-8 w-8 border-4 border-primary-unne border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[10px] font-black text-primary-unne uppercase mt-4 tracking-widest">Sincronizando...</p>
          </div>
        </div>
      )}
    </div>
  )
}