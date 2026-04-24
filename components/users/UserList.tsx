"use client"
import { useEffect, useState, useCallback } from 'react'
import { userService } from '@/services/userService'
import { Usuario } from '@/types/user'

interface Props {
  claveRecarga: number;
  alEditar: (usuario: Usuario) => void;
}

export default function UserList({ claveRecarga, alEditar }: Props) {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [cargando, setCargando] = useState(true)

  // 🔄 Función para traer datos (memorizada para evitar bucles)
  const obtenerDatosUsuarios = useCallback(async () => {
    setCargando(true)
    try {
      const { data, error } = await userService.obtenerUsuarios()
      if (error) throw error
      if (data) setUsuarios(data)
    } catch (err: any) {
      console.error("Error obteniendo usuarios:", err.message)
    } finally {
      setCargando(false)
    }
  }, [])

  // Escuchar cambios externos (cuando el formulario crea/edita)
  useEffect(() => { 
    obtenerDatosUsuarios() 
  }, [claveRecarga, obtenerDatosUsuarios])

  // 🛡️ Lógica de Alta/Baja
  const gestionarCambioEstado = async (usuario: Usuario) => {
    const nuevoEstado = usuario.estado === 'activo' ? 'inactivo' : 'activo'
    const accion = nuevoEstado === 'activo' ? 'ACTIVAR' : 'DESACTIVAR'

    if (confirm(`¿Está seguro que desea ${accion} al usuario ${usuario.nombre}?`)) {
      setCargando(true) 
      try {
        const { error } = await userService.actualizarUsuario(usuario.id_usuario!, { estado: nuevoEstado })
        if (error) throw error
        
        // Refrescamos la lista tras el cambio
        await obtenerDatosUsuarios()
      } catch (err: any) {
        alert("No se pudo cambiar el estado: " + err.message)
        setCargando(false)
      }
    }
  }

  // Filtro inteligente (Nombre + Apellido + DNI)
  const usuariosFiltrados = usuarios.filter(usuario => 
    `${usuario.nombre} ${usuario.apellido} ${usuario.dni}`.toLowerCase().includes(busqueda.toLowerCase())
  )

  // Función para limpiar buscador y sincronizar datos
  const gestionarSincronizacion = () => {
    setBusqueda('')       
    obtenerDatosUsuarios()    
  }

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm min-h-125 flex flex-col">
      {/* Header con Buscador */}
      <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-white sticky top-0 z-10 rounded-t-2xl">
        <div className="relative w-full max-w-md">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 text-lg">search</span>
          <input 
            type="text" 
            placeholder="Buscar por nombre o DNI..." 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:bg-white focus:border-primary-unne outline-none transition-all placeholder:text-zinc-400"
          />
        </div>
        
        <button 
          onClick={gestionarSincronizacion} 
          disabled={cargando}
          className="ml-4 p-2.5 text-zinc-400 hover:text-primary-unne hover:bg-primary-unne/5 rounded-xl transition-all disabled:opacity-50"
          title="Sincronizar ahora"
        >
          <span className={`material-symbols-outlined ${cargando ? 'animate-spin' : ''}`}>sync</span>
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
            {usuariosFiltrados.length > 0 ? (
              usuariosFiltrados.map((usuario) => (
                <tr key={usuario.id_usuario} className={`group hover:bg-zinc-50/40 transition-colors ${usuario.estado === 'inactivo' ? 'bg-zinc-50/20' : ''}`}>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold text-xs shadow-sm ${
                        usuario.estado === 'activo' ? 'bg-primary-unne text-white' : 'bg-zinc-200 text-zinc-500'
                      }`}>
                        {usuario.nombre[0]}{usuario.apellido[0]}
                      </div>
                      <div>
                        <p className={`font-bold text-sm tracking-tight ${usuario.estado === 'inactivo' ? 'text-zinc-400' : 'text-zinc-900'}`}>
                          {usuario.nombre} {usuario.apellido}
                        </p>
                        <div className="flex gap-2 items-center mt-0.5">
                            <span className="text-[10px] font-mono text-zinc-400">{usuario.dni}</span>
                            <span className="w-1 h-1 bg-zinc-200 rounded-full"></span>
                            <span className="text-[9px] font-black uppercase text-primary-unne/60">{usuario.rol}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter border ${
                      usuario.estado === 'activo' 
                        ? 'bg-green-50 text-green-700 border-green-100' 
                        : 'bg-zinc-100 text-zinc-500 border-zinc-200'
                    }`}>
                      <span className={`h-1 w-1 rounded-full mr-1.5 ${usuario.estado === 'activo' ? 'bg-green-500' : 'bg-zinc-400'}`}></span>
                      {usuario.estado}
                    </span>
                  </td>

                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-1 md:opacity-0 group-hover:opacity-100 transition-all">
                        <button 
                          onClick={() => alEditar(usuario)} 
                          disabled={usuario.estado === 'inactivo'} 
                          className={`p-2 rounded-lg transition-all ${
                            usuario.estado === 'inactivo' 
                              ? 'text-zinc-200 cursor-not-allowed opacity-50' 
                              : 'text-zinc-400 hover:text-primary-unne hover:bg-primary-unne/5'
                          }`} 
                          title={usuario.estado === 'inactivo' ? 'Reactive al usuario para editar' : 'Editar perfil'}
                        >
                          <span className="material-symbols-outlined text-xl">
                            {usuario.estado === 'inactivo' ? 'lock' : 'edit_note'}
                          </span>
                        </button>
                      
                      <button 
                        onClick={() => gestionarCambioEstado(usuario)} 
                        className={`p-2 rounded-lg transition-colors ${
                          usuario.estado === 'activo' ? 'text-zinc-300 hover:text-red-500 hover:bg-red-50' : 'text-primary-unne hover:bg-primary-unne/5'
                        }`} 
                        title={usuario.estado === 'activo' ? 'Desactivar' : 'Reactivar'}
                      >
                        <span className="material-symbols-outlined text-xl">
                          {usuario.estado === 'activo' ? 'person_off' : 'how_to_reg'}
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : !cargando && (
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
      
      <div className="p-4 border-t border-zinc-50 bg-zinc-50/30 text-[9px] text-zinc-400 font-bold uppercase tracking-widest flex justify-between">
        <span>Total: {usuariosFiltrados.length} Usuarios</span>
        <span>SIC-UNNE Database</span>
      </div>

      {cargando && (
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