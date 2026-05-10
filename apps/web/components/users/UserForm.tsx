"use client"
import { useState, useEffect } from 'react'
import { userService } from '@/services/userService'
import { esquemaUsuario } from '@/utils/validations'
import { Usuario } from '@/types/user'


interface Props {
  alCrearUsuario: () => void;
  usuarioEditando: Usuario | null;
  alCancelarEdicion: () => void;
}

export default function UserForm({ alCrearUsuario, usuarioEditando, alCancelarEdicion }: Props) {
  // 1. Estados traducidos
  const [cargando, setCargando] = useState(false)
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' })

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
    
    // 1. Objeto base (Datos mutables)
    const datosUsuario: any = {
      nombre: (datosFormulario.get('nombre') as string).trim(),
      apellido: (datosFormulario.get('apellido') as string).trim(),
      email: (datosFormulario.get('email') as string).trim(),
      rol: datosFormulario.get('rol') as 'estudiante' | 'admin',
      estado: usuarioEditando?.estado || 'activo'
    }

    // 2. DNI: Lo tomamos de la prop si editamos, o del form si es nuevo
    const dniAValidar = usuarioEditando ? usuarioEditando.dni : (datosFormulario.get('dni') as string) || '';

    // 1. Asignamos el DNI (que ya validamos arriba)
    datosUsuario.dni = dniAValidar;

    // 2. Si es un registro NUEVO, capturamos la contraseña en texto plano
    if (!usuarioEditando) {
      const valorClave = datosFormulario.get('contraseña') as string;
      datosUsuario.contraseña = valorClave; 
    }

    // --- 🛡️ VALIDACIONES ---
    const objetoAValidar = { ...datosUsuario, dni: dniAValidar };
    const esNuevo = !usuarioEditando;

    if (!esquemaUsuario.validarObligatorios(objetoAValidar, esNuevo)) {
    setCargando(false);
    return setMensaje({ texto: '⚠️ Campos obligatorios faltantes', tipo: 'error' });
    }

    try {
      let respuesta;
      if (usuarioEditando?.id_usuario) {
        // En edición, usamos el servicio traducido
        respuesta = await userService.actualizarUsuario(usuarioEditando.id_usuario, datosUsuario)
      } else {
        respuesta = await userService.crearUsuario(datosUsuario)
      }

      if (respuesta.error) throw respuesta.error

      setMensaje({ texto: '✅ Éxito', tipo: 'success' })
      formularioActual.reset() 
      alCrearUsuario() 
      if (usuarioEditando) alCancelarEdicion() 
      
    } catch (error: any) {
      if (error.code === '23505') {
        const mensajeError = error.message?.toLowerCase() || '';
        if (mensajeError.includes('dni')) setMensaje({ texto: '❌ DNI ya registrado', tipo: 'error' });
        else if (mensajeError.includes('email')) setMensaje({ texto: '❌ Email ya en uso', tipo: 'error' });
        else setMensaje({ texto: '❌ Datos duplicados', tipo: 'error' });
      } else {
        setMensaje({ texto: `❌ Error: ${error.message}`, tipo: 'error' })
      }
    } finally {
      setCargando(false) 
    }
  }

  return (
    <div 
      key={usuarioEditando?.id_usuario || 'nuevo-usuario'} 
      className="bg-white border border-zinc-200 rounded-2xl shadow-sm sticky top-28"
    >
      <div className="p-6 border-b border-zinc-100 bg-zinc-50/30">
        <h3 className="font-headline font-bold text-primary-unne text-lg">
          {usuarioEditando ? 'Modificar Registro' : 'Registrar Nuevo Perfil'}
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
            defaultValue={usuarioEditando?.dni} 
            readOnly={!!usuarioEditando}
            onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, ''); }}
            className={`w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:border-primary-unne outline-none ${
              usuarioEditando ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed' : 'bg-white'
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
              defaultValue={usuarioEditando?.nombre} 
              required
              onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, ''); }}
              className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:border-primary-unne outline-none" 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-zinc-400 uppercase">Apellido</label>
            <input 
              name="apellido" 
              defaultValue={usuarioEditando?.apellido} 
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
            defaultValue={usuarioEditando?.email} 
            required
            className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:border-primary-unne outline-none" 
          />
        </div>

        {/* CONTRASEÑA */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-zinc-400 uppercase">
            {usuarioEditando ? 'Seguridad de Credenciales' : 'Contraseña de Acceso'}
          </label>
          <div className="relative">
            <input 
              name="contraseña" 
              type={usuarioEditando ? "text" : "password"} 
              defaultValue={usuarioEditando ? "••••••••••••" : ""} 
              readOnly={!!usuarioEditando} 
              required={!usuarioEditando}
              className={`w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm outline-none ${
                usuarioEditando ? 'bg-zinc-50 text-zinc-300 font-mono tracking-[0.3em]' : 'bg-white'
              }`} 
            />
          </div>
        </div>

        {/* ROL */}
        <div className="space-y-1.5 pb-2">
          <label className="text-[10px] font-black text-zinc-400 uppercase">Nivel de Acceso</label>
          <select 
            name="rol" 
            defaultValue={usuarioEditando?.rol || 'estudiante'} 
            className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm bg-white cursor-pointer"
          >
            <option value="estudiante">Estudiante</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        <div className="pt-2">
          <button type="submit" disabled={cargando} className="w-full bg-primary-unne text-white font-bold py-4 rounded-xl shadow-lg disabled:opacity-50 uppercase text-xs">
            {cargando ? 'Sincronizando...' : usuarioEditando ? 'Guardar Cambios' : 'Crear Usuario'}
          </button>
          {usuarioEditando && (
            <button type="button" onClick={alCancelarEdicion} className="w-full text-zinc-400 text-[10px] font-bold uppercase mt-4 hover:text-red-500">
              Cancelar Edición
            </button>
          )}
        </div>
      </form>
      
      {mensaje.texto && (
        <div className={`mx-6 mb-6 p-4 rounded-xl text-[10px] font-black text-center border ${
            mensaje.tipo === 'error' ? 'bg-red-50 text-red-500 border-red-100' : 'bg-green-50 text-green-600 border-green-100'
        }`}>
          {mensaje.texto.toUpperCase()}
        </div>
      )}
    </div>
  )
}