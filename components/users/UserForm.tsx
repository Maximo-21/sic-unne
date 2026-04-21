"use client"
import { useState, useEffect } from 'react'
import { userService } from '@/services/userService'
import { userSchema } from '@/utils/validations'
import { User } from '@/types/user'

interface Props {
  onUserCreated: () => void;
  userEditing: User | null;
  onCancelEdit: () => void;
}

export default function UserForm({ onUserCreated, userEditing, onCancelEdit }: Props) {
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState({ text: '', type: '' })

  // 💡 Limpiar mensaje después de 3 segundos
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
    
    // Armamos el objeto con los nombres exactos de tu DB
    const userData: any = {
      nombre: formData.get('nombre') as string,
      apellido: formData.get('apellido') as string,
      email: formData.get('email') as string,
      rol: formData.get('rol') as 'estudiante' | 'admin',
      contraseña: formData.get('contraseña') as string, // 🔑 Campo nuevo
      estado: userEditing?.estado || 'activo'
    }

    // El DNI solo lo enviamos si es un usuario NUEVO (porque es PK/Unique)
    if (!userEditing) {
      userData.dni = formData.get('dni') as string
    }

    // Validación básica antes de ir a Supabase
    if (!userSchema.validateRequired(userData) && !userEditing) {
      setLoading(false)
      return setMsg({ text: '⚠️ Todos los campos son obligatorios', type: 'error' })
    }

    try {
      let res;
      if (userEditing?.id_usuario) {
        // 💡 MODO EDICIÓN
        // Si la contraseña está vacía en edición, la quitamos para no pisarla con algo vacío
        if (!userData.contraseña) delete userData.contraseña;
        
        res = await userService.updateUser(userEditing.id_usuario, userData)
      } else {
        // 💡 MODO CREACIÓN
        res = await userService.createUser(userData)
      }

      if (res.error) throw res.error

      setMsg({ text: '✅ Operación exitosa', type: 'success' })
      
      // 🧼 RESET DE CAMPOS: Esto soluciona que queden rellenos
      currentForm.reset() 
      
      onUserCreated() // Refresca la lista de la derecha
      if (userEditing) onCancelEdit() // Quita el modo edición
      
    } catch (err: any) {
      setMsg({ text: `❌ Error: ${err.message}`, type: 'error' })
    } finally {
      setLoading(false) 
    }
  }

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm sticky top-28">
      <div className="p-6 border-b border-zinc-100 bg-zinc-50/30">
        <h3 className="font-headline font-bold text-primary-unne text-lg">
          {userEditing ? 'Modificar Registro' : 'Registrar Nuevo Perfil'}
        </h3>
        <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-widest mt-1">
            Administración SIC-UNNE
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {/* DNI: Solo lectura si estamos editando */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-zinc-400 uppercase ml-1">DNI del Usuario</label>
          <input 
            name="dni" 
            required 
            defaultValue={userEditing?.dni} 
            readOnly={!!userEditing}
            className={`w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:border-primary-unne outline-none transition-all ${userEditing ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed' : 'bg-white'}`} 
            placeholder="Ej: 42123456"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-zinc-400 uppercase ml-1">Nombre</label>
            <input name="nombre" defaultValue={userEditing?.nombre} className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:border-primary-unne outline-none" placeholder="Juan" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-zinc-400 uppercase ml-1">Apellido</label>
            <input name="apellido" defaultValue={userEditing?.apellido} className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:border-primary-unne outline-none" placeholder="Pérez" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-zinc-400 uppercase ml-1">Correo Institucional</label>
          <input name="email" type="email" defaultValue={userEditing?.email} className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:border-primary-unne outline-none" placeholder="ejemplo@unne.edu.ar" />
        </div>

        {/* 🔑 CAMPO CONTRASEÑA NUEVO */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-zinc-400 uppercase ml-1">Contraseña de Acceso</label>
          <input 
            name="contraseña" 
            type="password" 
            required={!userEditing} 
            placeholder={userEditing ? "Dejar vacío para mantener" : "Mínimo 6 caracteres"}
            className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:border-primary-unne outline-none" 
          />
        </div>

        <div className="space-y-1.5 pb-2">
          <label className="text-[10px] font-black text-zinc-400 uppercase ml-1">Nivel de Acceso</label>
          <select name="rol" defaultValue={userEditing?.rol || 'estudiante'} className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:border-primary-unne outline-none bg-white cursor-pointer">
            <option value="estudiante">Estudiante</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        <div className="pt-2">
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-primary-unne hover:bg-primary-unne/95 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary-unne/10 transition-all active:scale-[0.98] disabled:opacity-50 uppercase text-xs tracking-widest"
          >
            {loading ? 'Sincronizando...' : userEditing ? 'Guardar Cambios' : 'Crear Usuario'}
          </button>
          
          {userEditing && (
            <button 
                type="button" 
                onClick={onCancelEdit} 
                className="w-full text-zinc-400 text-[10px] font-bold uppercase mt-4 hover:text-red-500 transition-colors tracking-tighter"
            >
              Cancelar Edición
            </button>
          )}
        </div>
      </form>

      {msg.text && (
        <div className={`mx-6 mb-6 p-4 rounded-xl text-[10px] font-black text-center border animate-pulse ${
            msg.type === 'error' ? 'bg-red-50 text-red-500 border-red-100' : 'bg-green-50 text-green-600 border-green-100'
        }`}>
          {msg.text.toUpperCase()}
        </div>
      )}
    </div>
  )
}