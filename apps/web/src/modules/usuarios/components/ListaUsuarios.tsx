"use client"
import { useState } from 'react'
import { useUsuarios } from '../hooks/useUsuarios'
import { Usuario } from '../types/Usuario'
import EtiquetaEstado from '@shared/components/EtiquetaEstado'

interface Props {
  claveRecarga: number;
  alSeleccionarParaEditar: (usuario: Usuario) => void;
  alCambiarEstado: () => void;
}

export default function ListaUsuarios({ claveRecarga, alSeleccionarParaEditar, alCambiarEstado }: Props) {
  const { usuarios, cargando, cargar, cambiarEstado } = useUsuarios(claveRecarga)
  const [busqueda, setBusqueda] = useState('')

  const usuariosFiltrados = usuarios.filter((u) =>
    `${u.nombre} ${u.apellido} ${u.dni}`.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm min-h-125 flex flex-col relative">
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
          onClick={cargar}
          disabled={cargando}
          className="ml-4 p-2.5 text-zinc-400 hover:text-primary-unne rounded-xl transition-all disabled:opacity-50"
        >
          <span className={`material-symbols-outlined ${cargando ? 'animate-spin' : ''}`}>sync</span>
        </button>
      </div>

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
            {usuariosFiltrados.map((usuario) => (
              <tr key={usuario.id_usuario} className={`group hover:bg-zinc-50/40 ${usuario.estado === 'inactivo' ? 'bg-zinc-50/20' : ''}`}>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                      usuario.estado === 'activo' ? 'bg-primary-unne text-white' : 'bg-zinc-200 text-zinc-500'
                    }`}>
                      {usuario.nombre[0]}{usuario.apellido[0]}
                    </div>
                    <div>
                      <p className={`font-bold text-sm ${usuario.estado === 'inactivo' ? 'text-zinc-400' : 'text-zinc-900'}`}>
                        {usuario.nombre} {usuario.apellido}
                      </p>
                      <span className="text-[10px] font-mono text-zinc-400">{usuario.dni} | {usuario.rol_descripcion}</span>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <EtiquetaEstado estado={usuario.estado} />
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
                      onClick={() => cambiarEstado(usuario, alCambiarEstado)}
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
            ))}
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
