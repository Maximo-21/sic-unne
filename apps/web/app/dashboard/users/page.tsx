"use client"
import { useState } from 'react'
// 1. Usamos los Path Aliases que configuramos en el tsconfig.json
import FormularioUsuario from '@modules/usuarios/components/FormularioUsuario'
import ListaUsuarios from '@modules/usuarios/components/ListaUsuarios'
import { Usuario } from '@modules/usuarios/types/Usuario'

export default function UsersPage() {
  // 2. Clave para forzar el refresco de la lista (técnica de React)
  const [claveRecarga, setClaveRecarga] = useState(0)

  // 3. Tipamos el estado con nuestra entidad 'Usuario' en lugar de 'any'
  const [usuarioParaEditar, setUsuarioParaEditar] = useState<Usuario | null>(null)

  // 4. Función para disparar la actualización de la lista
  const refrescarLista = () => {
    setClaveRecarga(prev => prev + 1)
    setUsuarioParaEditar(null) // Limpiamos la edición por seguridad al refrescar
  }

  return (
    <div className="animate-in fade-in duration-700">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-primary-unne tracking-tighter uppercase">
          Directorio de Usuarios
        </h1>
        <p className="text-zinc-400 text-sm font-medium">
          Gestión académica y control de accesos de la UNNE.
        </p>
      </div>

      <div className="grid grid-cols-12 gap-10 items-start">
        {/* COLUMNA DEL FORMULARIO */}
        <div className="col-span-12 xl:col-span-4 sticky top-28">
          <FormularioUsuario
            alGuardar={refrescarLista}
            usuarioExistente={usuarioParaEditar}
            alCancelar={() => setUsuarioParaEditar(null)}
          />
        </div>

        {/* COLUMNA DE LA LISTA */}
        <div className="col-span-12 xl:col-span-8">
          <ListaUsuarios
            claveRecarga={claveRecarga}
            alSeleccionarParaEditar={(u: Usuario) => setUsuarioParaEditar(u)}
            alCambiarEstado={refrescarLista}
          />
        </div>
      </div>
    </div>
  )
}