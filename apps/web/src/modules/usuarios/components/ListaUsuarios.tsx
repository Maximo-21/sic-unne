"use client"
import { useEffect, useState, useCallback } from 'react'
import { UsuariosServicio } from '@modules/usuarios/services/UsuariosServicio'
import { Usuario } from '@modules/usuarios/types/Usuario'

interface Props {
  claveRecarga: number;
  alSeleccionarParaEditar: (usuario: Usuario) => void;
  alCambiarEstado: () => void; // Para avisar a la página que algo cambió
}

export default function ListaUsuarios({ claveRecarga, alSeleccionarParaEditar, alCambiarEstado }: Props) {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [cargando, setCargando] = useState(true)

  // 🔄 Obtener datos desde nuestra nueva API de NestJS
  const obtenerDatosUsuarios = useCallback(async () => {
    setCargando(true)
    try {
      // Usamos el nuevo servicio estático
      const data = await UsuariosServicio.obtenerTodos()
      setUsuarios(data)
    } catch (err: any) {
      console.error("Error obteniendo usuarios:", err.message)
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    obtenerDatosUsuarios()
  }, [claveRecarga, obtenerDatosUsuarios])

  // 🛡️ Lógica de Alta/Baja (Sincronizada con el Backend)
  const gestionarCambioEstado = async (usuario: Usuario) => {
    const nuevoEstado = usuario.estado === 'activo' ? 'inactivo' : 'activo'
    const accion = nuevoEstado === 'activo' ? 'ACTIVAR' : 'DESACTIVAR'

    if (confirm(`¿Está seguro que desea ${accion} al usuario ${usuario.nombre}?`)) {
      setCargando(true)
      try {
        // Llamamos a los métodos que coinciden con los casos de uso
        if (nuevoEstado === 'activo') {
          await UsuariosServicio.activar(usuario.id!)
        } else {
          await UsuariosServicio.darDeBaja(usuario.id!)
        }

        alCambiarEstado() // Refrescamos a través del padre (page.tsx)
      } catch (err: any) {
        alert("No se pudo cambiar el estado: " + err.message)
        setCargando(false)
      }
    }
  }

  const usuariosFiltrados = usuarios.filter(usuario =>
    `${usuario.nombre} ${usuario.apellido} ${usuario.dni}`.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm min-h-[500px] flex flex-col relative">
      {/* Header con Buscador */}
      <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-white sticky top-0 z-10 rounded-t-2xl">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Buscar por nombre o DNI..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-4 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:bg-white focus:border-primary-unne outline-none transition-all"
          />
        </div>

        <button
          onClick={obtenerDatosUsuarios}
          disabled={cargando}
          className="ml-4 p-2.5 text-zinc-400 hover:text-primary-unne rounded-xl transition-all disabled:opacity-50"
        >
          <span className={`material-symbols-outlined ${cargando ? 'animate-spin' : ''}`}>sync</span>
        </button>
      </div>

      {/* Tabla de Datos */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50/50 text-[11px] font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-100">
              <th className="px-8 py-5">Miembro</th>
              <th className="px-8 py-5">Estado</th>
              <th className="px-8 py-5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {usuariosFiltrados.length > 0 ? (
              usuariosFiltrados.map((usuario) => (
                <tr key={usuario.id} className={`group hover:bg-zinc-50/40 ${usuario.estado === 'inactivo' ? 'bg-zinc-50/20' : ''}`}>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold text-xs ${usuario.estado === 'activo' ? 'bg-primary-unne text-white' : 'bg-zinc-200 text-zinc-500'
                        }`}>
                        {usuario.nombre[0]}{usuario.apellido[0]}
                      </div>
                      <div>
                        <p className={`font-bold text-sm ${usuario.estado === 'inactivo' ? 'text-zinc-400' : 'text-zinc-900'}`}>
                          {usuario.nombre} {usuario.apellido}
                        </p>
                        <span className="text-[10px] font-mono text-zinc-400">{usuario.dni} | {usuario.rol}</span>
                      </div>
                    </div>
                  </td>

                  <td className="px-8 py-5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${usuario.estado === 'activo' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-zinc-100 text-zinc-500 border-zinc-200'
                      }`}>
                      {usuario.estado}
                    </span>
                  </td>

                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => alSeleccionarParaEditar(usuario)}
                        className="p-2 text-zinc-400 hover:text-primary-unne"
                        title="Editar"
                      >
                        <span className="material-symbols-outlined text-xl">edit_note</span>
                      </button>

                      <button
                        onClick={() => gestionarCambioEstado(usuario)}
                        className={`p-2 rounded-lg ${usuario.estado === 'activo' ? 'text-zinc-300 hover:text-red-500' : 'text-primary-unne'}`}
                        title={usuario.estado === 'activo' ? 'Desactivar' : 'Activar'}
                      >
                        <span className="material-symbols-outlined text-xl">
                          {usuario.estado === 'activo' ? 'person_off' : 'how_to_reg'}
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : null}
          </tbody>
        </table>
      </div>

      {cargando && (
        <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-20">
          <div className="animate-spin h-8 w-8 border-4 border-primary-unne border-t-transparent rounded-full"></div>
        </div>
      )}
    </div>
  )
}