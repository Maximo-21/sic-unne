"use client"
import { useState, useEffect } from 'react'
import { UsuariosServicio } from '@modules/usuarios/services/UsuariosServicio'
import { Validaciones } from '@shared/utils/Validaciones'
import { Usuario } from '@modules/usuarios/types/Usuario'

interface Props {
  alGuardar: () => void;
  usuarioExistente: Usuario | null;
  alCancelar: () => void;
}

export default function FormularioUsuario({ alGuardar, usuarioExistente, alCancelar }: Props) {
  const [cargando, setCargando] = useState(false)
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' })

  // Limpieza automática de mensajes
  useEffect(() => {
    if (mensaje.texto) {
      const temporizador = setTimeout(() => setMensaje({ texto: '', tipo: '' }), 3000);
      return () => clearTimeout(temporizador);
    }
  }, [mensaje]);

  async function gestionarEnvio(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formularioActual = e.currentTarget
    setCargando(true)
    setMensaje({ texto: '', tipo: '' })

    const datosFormulario = new FormData(formularioActual)

    // 1. Estructura de datos para validación interna
    const datosUsuario: any = {
      nombre: (datosFormulario.get('nombre') as string).trim(),
      apellido: (datosFormulario.get('apellido') as string).trim(),
      email: (datosFormulario.get('email') as string).trim(),
      rol: datosFormulario.get('rol') as string,
      estado: usuarioExistente?.estado || 'activo'
    }

    const dniAValidar = usuarioExistente ? usuarioExistente.dni : (datosFormulario.get('dni') as string) || '';
    datosUsuario.dni = dniAValidar;

    // Solo incluimos contraseña si es un registro nuevo
    if (!usuarioExistente) {
      datosUsuario.contraseña = datosFormulario.get('contraseña') as string;
    }

    // --- VALIDACIONES ---
    if (!Validaciones.validarObligatorios(datosUsuario, !usuarioExistente)) {
      setCargando(false);
      return setMensaje({ texto: '⚠️ Campos obligatorios faltantes', tipo: 'error' });
    }

    // Mapa de descripción de rol a id_rol (debe coincidir con la tabla roles en BD)
    const rolMap: Record<string, number> = { estudiante: 1, admin: 2 };
    const carrera = (datosFormulario.get('carrera') as string)?.trim() || null;

    try {
      if (usuarioExistente?.id_usuario) {
        // ACTUALIZAR: solo campos editables, sin DNI ni contraseña
        await UsuariosServicio.actualizar(usuarioExistente.id_usuario, {
          nombre: datosUsuario.nombre,
          apellido: datosUsuario.apellido,
          email: datosUsuario.email,
          carrera,
          idRol: rolMap[datosUsuario.rol] ?? 1,
        })
      } else {
        // CREAR: incluye DNI, contraseña (sin ñ) e idRol numérico
        await UsuariosServicio.crear({
          dni: datosUsuario.dni,
          nombre: datosUsuario.nombre,
          apellido: datosUsuario.apellido,
          email: datosUsuario.email,
          contrasena: datosUsuario.contraseña,
          carrera,
          idRol: rolMap[datosUsuario.rol] ?? 1,
        })
      }

      setMensaje({ texto: '✅ Operación Exitosa', tipo: 'success' })
      formularioActual.reset()
      alGuardar() // Refresca la lista en page.tsx

    } catch (error: any) {
      // Manejo de errores de la API (CORS, Duplicados, etc.)
      const msg = error.message || 'Error en el servidor';
      setMensaje({ texto: `❌ ${msg}`, tipo: 'error' })
    } finally {
      setCargando(false)
    }
  }

  return (
    <div
      key={usuarioExistente?.id_usuario || 'nuevo-usuario'}
      className="bg-white border border-zinc-200 rounded-2xl shadow-sm"
    >
      <div className="p-6 border-b border-zinc-100 bg-zinc-50/30">
        <h3 className="font-bold text-primary-unne text-lg">
          {usuarioExistente ? 'Modificar Registro' : 'Registrar Nuevo Perfil'}
        </h3>
        <p className="text-[11px] text-zinc-400 font-bold uppercase mt-1">Administración SIC-UNNE</p>
      </div>

      <form onSubmit={gestionarEnvio} className="p-6 space-y-4">
        {/* DNI */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-zinc-400 uppercase">DNI del Usuario</label>
          <input
            name="dni"
            required
            defaultValue={usuarioExistente?.dni}
            readOnly={!!usuarioExistente}
            onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, ''); }}
            className={`w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:border-primary-unne outline-none ${usuarioExistente ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed' : 'bg-white'
              }`}
            maxLength={9}
          />
        </div>

        {/* NOMBRE Y APELLIDO */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-zinc-400 uppercase">Nombre</label>
            <input
              name="nombre"
              defaultValue={usuarioExistente?.nombre}
              required
              onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, ''); }}
              className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:border-primary-unne outline-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-zinc-400 uppercase">Apellido</label>
            <input
              name="apellido"
              defaultValue={usuarioExistente?.apellido}
              required
              onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, ''); }}
              className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:border-primary-unne outline-none"
            />
          </div>
        </div>

        {/* EMAIL */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-zinc-400 uppercase">Correo Electrónico</label>
          <input
            name="email"
            type="email"
            defaultValue={usuarioExistente?.email}
            required
            className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:border-primary-unne outline-none"
          />
        </div>

        {/* CARRERA */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-zinc-400 uppercase">Carrera (Opcional)</label>
          <input
            name="carrera"
            defaultValue={usuarioExistente?.carrera ?? ''}
            placeholder="Ej: Ingeniería en Sistemas"
            className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:border-primary-unne outline-none"
          />
        </div>

        {/* CONTRASEÑA (Solo visible/editable en creación) */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-zinc-400 uppercase">
            {usuarioExistente ? 'Seguridad de Credenciales' : 'Contraseña de Acceso'}
          </label>
          <input
            name="contraseña"
            type={usuarioExistente ? "text" : "password"}
            defaultValue={usuarioExistente ? "••••••••••••" : ""}
            readOnly={!!usuarioExistente}
            required={!usuarioExistente}
            className={`w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm outline-none ${usuarioExistente ? 'bg-zinc-50 text-zinc-300' : 'bg-white'
              }`}
          />
        </div>

        {/* ROL */}
        <div className="space-y-1.5 pb-2">
          <label className="text-[10px] font-black text-zinc-400 uppercase">Nivel de Acceso</label>
          <select
            name="rol"
            defaultValue={usuarioExistente?.rol_descripcion || 'estudiante'}
            className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm bg-white cursor-pointer"
          >
            <option value="estudiante">Estudiante</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        <div className="pt-2">
          <button type="submit" disabled={cargando} className="w-full bg-primary-unne text-white font-bold py-4 rounded-xl shadow-lg disabled:opacity-50 uppercase text-xs">
            {cargando ? 'Sincronizando...' : usuarioExistente ? 'Guardar Cambios' : 'Crear Usuario'}
          </button>
          {usuarioExistente && (
            <button type="button" onClick={alCancelar} className="w-full text-zinc-400 text-[10px] font-bold uppercase mt-4 hover:text-red-500">
              Cancelar Edición
            </button>
          )}
        </div>
      </form>

      {mensaje.texto && (
        <div className={`mx-6 mb-6 p-4 rounded-xl text-[10px] font-black text-center border ${mensaje.tipo === 'error' ? 'bg-red-50 text-red-500 border-red-100' : 'bg-green-50 text-green-600 border-green-100'
          }`}>
          {mensaje.texto.toUpperCase()}
        </div>
      )}
    </div>
  )
}