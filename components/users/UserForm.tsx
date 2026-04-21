"use client"
import { useState } from 'react'
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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const currentForm = e.currentTarget 
    setLoading(true)
    setMsg({ text: '', type: '' })

    const formData = new FormData(currentForm)
    const userData: any = {
      dni: formData.get('dni') as string,
      nombre: formData.get('nombre') as string,
      apellido: formData.get('apellido') as string,
      email: formData.get('email') as string,
      rol: formData.get('rol') as 'estudiante' | 'admin',
      estado: userEditing?.estado || 'activo'
    }

    if (!userSchema.validateRequired(userData)) {
      setLoading(false)
      return setMsg({ text: '⚠️ Faltan campos obligatorios', type: 'error' })
    }

    try {
      let res = userEditing?.id_usuario 
        ? await userService.updateUser(userEditing.id_usuario, userData)
        : await userService.createUser(userData)

      if (res.error) throw res.error

      setMsg({ text: '✅ Cambios guardados', type: 'success' })
      if (!userEditing) currentForm.reset()
      onUserCreated()
      if (userEditing) onCancelEdit()
    } catch (err: any) {
      setMsg({ text: `❌ Error: ${err.message}`, type: 'error' })
    } finally {
      setLoading(false) 
    }
  }

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm">
      <div className="p-6 border-b border-zinc-100 bg-zinc-50/30">
        <h3 className="font-headline font-bold text-primary-unne text-lg">
          {userEditing ? 'Modificar Usuario' : 'Registrar Usuario'}
        </h3>
        <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-widest mt-1">
            Información de cuenta
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-zinc-500 uppercase ml-1">DNI / ID</label>
          <input 
            name="dni" 
            required 
            defaultValue={userEditing?.dni} 
            readOnly={!!userEditing}
            className={`w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:border-primary-unne outline-none transition-all ${userEditing ? 'bg-zinc-50 text-zinc-400 font-medium' : 'bg-white'}`} 
            placeholder="Sin puntos"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-zinc-500 uppercase ml-1">Nombre</label>
            <input name="nombre" defaultValue={userEditing?.nombre} className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:border-primary-unne outline-none" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-zinc-500 uppercase ml-1">Apellido</label>
            <input name="apellido" defaultValue={userEditing?.apellido} className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:border-primary-unne outline-none" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-zinc-500 uppercase ml-1">Email Institucional</label>
          <input name="email" type="email" defaultValue={userEditing?.email} className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:border-primary-unne outline-none" />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-zinc-500 uppercase ml-1">Rol en el Sistema</label>
          <select name="rol" defaultValue={userEditing?.rol || 'estudiante'} className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:border-primary-unne outline-none bg-white">
            <option value="estudiante">Estudiante</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        <div className="pt-4">
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-primary-unne hover:bg-primary-unne/95 text-white font-bold py-4 rounded-xl shadow-md transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? 'PROCESANDO...' : userEditing ? 'ACTUALIZAR DATOS' : 'CREAR USUARIO'}
          </button>
          {userEditing && (
            <button type="button" onClick={onCancelEdit} className="w-full text-zinc-400 text-[11px] font-bold uppercase mt-4 hover:text-zinc-600 transition-colors">
              Descartar Cambios
            </button>
          )}
        </div>
      </form>

      {msg.text && (
        <div className={`mx-6 mb-6 p-3 rounded-xl text-[10px] font-bold text-center border ${msg.type === 'error' ? 'bg-red-50 text-red-500 border-red-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
          {msg.text.toUpperCase()}
        </div>
      )}
    </div>
  )
}