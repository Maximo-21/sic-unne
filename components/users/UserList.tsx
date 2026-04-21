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
  const [loading, setLoading] = useState(true)

  const fetchUsersData = async () => {
    setLoading(true)
    const { data, error } = await userService.fetchUsers()
    if (!error && data) setUsers(data)
    setLoading(false)
  }

  useEffect(() => { fetchUsersData() }, [refreshKey])

  const handleToggleStatus = async (user: User) => {
    const newStatus = user.estado === 'activo' ? 'inactivo' : 'activo'
    if (confirm(`¿Cambiar estado de ${user.nombre} a ${newStatus}?`)) {
      await userService.updateUser(user.id_usuario!, { estado: newStatus })
      fetchUsersData()
    }
  }

  const filteredUsers = users.filter(u => 
    (u.nombre + " " + u.apellido + " " + u.dni).toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm">
      {/* Search Header */}
      <div className="p-6 border-b border-zinc-100 flex justify-between items-center">
        <div className="relative w-full max-w-md">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 text-lg">search</span>
          <input 
            type="text" 
            placeholder="Filtrar por nombre, DNI o rol..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:bg-white focus:border-primary-unne outline-none transition-all"
          />
        </div>
        <button onClick={fetchUsersData} className="ml-4 p-2.5 text-zinc-400 hover:text-primary-unne hover:bg-zinc-50 rounded-xl transition-all">
          <span className="material-symbols-outlined">sync</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-zinc-50/50 text-[11px] font-bold text-zinc-500 uppercase tracking-[0.15em] border-b border-zinc-100">
              <th className="px-8 py-5">Miembro</th>
              <th className="px-8 py-5">Estado</th>
              <th className="px-8 py-5 text-right">Opciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {filteredUsers.map((u) => (
              <tr key={u.id_usuario} className="group hover:bg-zinc-50/40 transition-colors">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-primary-unne text-white flex items-center justify-center font-bold text-xs shadow-sm">
                      {u.nombre[0]}{u.apellido[0]}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-zinc-900 leading-none">{u.nombre} {u.apellido}</p>
                      <p className="text-[10px] text-zinc-400 font-semibold uppercase mt-1">{u.dni} • {u.rol}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    u.estado === 'activo' ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-500'
                  }`}>
                    {u.estado}
                  </span>
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => onEdit(u)} className="p-2 text-zinc-400 hover:text-primary-unne transition-colors" title="Editar">
                      <span className="material-symbols-outlined text-xl">edit</span>
                    </button>
                    <button onClick={() => handleToggleStatus(u)} className={`p-2 transition-colors ${u.estado === 'activo' ? 'text-zinc-300 hover:text-red-500' : 'text-primary-unne'}`} title={u.estado === 'activo' ? 'Desactivar' : 'Activar'}>
                      <span className="material-symbols-outlined text-xl">
                        {u.estado === 'activo' ? 'do_not_disturb_on' : 'check_circle'}
                      </span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {loading && <div className="p-20 text-center text-zinc-400 text-[10px] font-bold uppercase tracking-widest animate-pulse">Cargando base de datos...</div>}
    </div>
  )
}