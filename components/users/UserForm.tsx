"use client"
import { useState, useEffect } from 'react'
import { userService } from '@/services/userService'
import { userSchema } from '@/utils/validations'
import { User } from '@/types/user'
import bcrypt from 'bcryptjs'

interface Props {
  onUserCreated: () => void;
  userEditing: User | null;
  onCancelEdit: () => void;
}

export default function UserForm({ onUserCreated, userEditing, onCancelEdit }: Props) {
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState({ text: '', type: '' })

  useEffect(() => {
    if (msg.text) {
      const timer = setTimeout(() => setMsg({ text: '', type: '' }), 3000);
      return () => clearTimeout(timer);
    }
  }, [msg]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const currentForm = e.currentTarget 
    setLoading(true)
    setMsg({ text: '', type: '' })

    const formData = new FormData(currentForm)
    
    // 1. Objeto base (Datos mutables)
    const userData: any = {
      nombre: (formData.get('nombre') as string).trim(),
      apellido: (formData.get('apellido') as string).trim(),
      email: (formData.get('email') as string).trim(),
      rol: formData.get('rol') as 'estudiante' | 'admin',
      estado: userEditing?.estado || 'activo'
    }

    // 2. DNI: Lo tomamos de la prop si editamos, o del form si es nuevo
    const dniToValidate = userEditing ? userEditing.dni : (formData.get('dni') as string) || '';

    // 🔒 Hasheo solo para NUEVOS
    if (!userEditing) {
      const passValue = formData.get('contraseña') as string;
      try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(passValue, salt);
        userData.contraseña = hashedPassword; 
        userData.dni = dniToValidate;
      } catch (hashError) {
        setLoading(false);
        return setMsg({ text: '❌ Error de encriptación', type: 'error' });
      }
    }

    // --- 🛡️ VALIDACIONES ---
    if (!userSchema.validateRequired({ ...userData, dni: dniToValidate })) {
      setLoading(false);
      return setMsg({ text: '⚠️ Campos obligatorios faltantes', type: 'error' });
    }

    try {
      let res;
      if (userEditing?.id_usuario) {
        // En edición, userData NO tiene la contraseña, así no pisamos el hash
        res = await userService.updateUser(userEditing.id_usuario, userData)
      } else {
        res = await userService.createUser(userData)
      }

      if (res.error) throw res.error

      setMsg({ text: '✅ Éxito', type: 'success' })
      currentForm.reset() 
      onUserCreated() 
      if (userEditing) onCancelEdit() 
      
    } catch (err: any) {
      if (err.code === '23505') {
        const errorMsg = err.message?.toLowerCase() || '';
        if (errorMsg.includes('dni')) setMsg({ text: '❌ DNI ya registrado', type: 'error' });
        else if (errorMsg.includes('email')) setMsg({ text: '❌ Email ya en uso', type: 'error' });
        else setMsg({ text: '❌ Datos duplicados', type: 'error' });
      } else {
        setMsg({ text: `❌ Error: ${err.message}`, type: 'error' })
      }
    } finally {
      setLoading(false) 
    }
  }

  return (
    <div 
      // 🔑 LA CLAVE DEL ÉXITO: Forzamos el reset cuando cambia el usuario
      key={userEditing?.id_usuario || 'new-user'} 
      className="bg-white border border-zinc-200 rounded-2xl shadow-sm sticky top-28"
    >
      <div className="p-6 border-b border-zinc-100 bg-zinc-50/30">
        <h3 className="font-headline font-bold text-primary-unne text-lg">
          {userEditing ? 'Modificar Registro' : 'Registrar Nuevo Perfil'}
        </h3>
        <p className="text-[11px] text-zinc-400 font-bold uppercase mt-1">Administración SIC-UNNE</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {/* DNI */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-zinc-400 uppercase">DNI del Usuario</label>
          <input 
            name="dni" 
            required 
            defaultValue={userEditing?.dni} 
            readOnly={!!userEditing}
            onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, ''); }}
            className={`w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:border-primary-unne outline-none ${
              userEditing ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed' : 'bg-white'
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
              defaultValue={userEditing?.nombre} 
              required
              onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, ''); }}
              className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:border-primary-unne outline-none" 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-zinc-400 uppercase">Apellido</label>
            <input 
              name="apellido" 
              defaultValue={userEditing?.apellido} 
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
            defaultValue={userEditing?.email} 
            required
            className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:border-primary-unne outline-none" 
          />
        </div>

        {/* CONTRASEÑA */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-zinc-400 uppercase">
            {userEditing ? 'Seguridad de Credenciales' : 'Contraseña de Acceso'}
          </label>
          <div className="relative">
            <input 
              name="contraseña" 
              type={userEditing ? "text" : "password"} 
              defaultValue={userEditing ? "••••••••••••" : ""} 
              readOnly={!!userEditing} 
              required={!userEditing}
              className={`w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm outline-none ${
                userEditing ? 'bg-zinc-50 text-zinc-300 font-mono tracking-[0.3em]' : 'bg-white'
              }`} 
            />
          </div>
        </div>

        {/* ROL: Aquí estaba el fallo del 'estudiante' fijo */}
        <div className="space-y-1.5 pb-2">
          <label className="text-[10px] font-black text-zinc-400 uppercase">Nivel de Acceso</label>
          <select 
            name="rol" 
            defaultValue={userEditing?.rol || 'estudiante'} 
            className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm bg-white cursor-pointer"
          >
            <option value="estudiante">Estudiante</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        <div className="pt-2">
          <button type="submit" disabled={loading} className="w-full bg-primary-unne text-white font-bold py-4 rounded-xl shadow-lg disabled:opacity-50 uppercase text-xs">
            {loading ? 'Sincronizando...' : userEditing ? 'Guardar Cambios' : 'Crear Usuario'}
          </button>
          {userEditing && (
            <button type="button" onClick={onCancelEdit} className="w-full text-zinc-400 text-[10px] font-bold uppercase mt-4 hover:text-red-500">
              Cancelar Edición
            </button>
          )}
        </div>
      </form>
      {/* Mensajes de error/éxito */}
      {msg.text && (
        <div className={`mx-6 mb-6 p-4 rounded-xl text-[10px] font-black text-center border ${
            msg.type === 'error' ? 'bg-red-50 text-red-500 border-red-100' : 'bg-green-50 text-green-600 border-green-100'
        }`}>
          {msg.text.toUpperCase()}
        </div>
      )}
    </div>
  )
}