"use client"

import { useState } from 'react'
import { userService } from '@/services/userService'
import { userSchema } from '@/utils/validations' // Importamos las "leyes" del sistema
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
      estado: userEditing?.estado || 'activo' as const
    }

    // --- 🛡️ CAPA DE VALIDACIONES TÉCNICAS (BACKEND-LIKE) ---
    
    // 1. Verificar campos vacíos
    if (!userSchema.validateRequired(userData)) {
      setLoading(false)
      return setMsg({ text: '⚠️ All fields are required', type: 'error' })
    }

    // 2. Validar DNI (7-9 números)
    if (!userSchema.validateDNI(userData.dni)) {
      setLoading(false)
      return setMsg({ text: '⚠️ Invalid DNI (Numbers only, 7-9 digits)', type: 'error' })
    }

    // 3. Validar Nombre y Apellido (Sin números)
    if (!userSchema.validateName(userData.nombre) || !userSchema.validateName(userData.apellido)) {
      setLoading(false)
      return setMsg({ text: '⚠️ Names and Lastnames cannot contain numbers', type: 'error' })
    }

    // 4. Validar Email format
    if (!userSchema.validateEmail(userData.email)) {
      setLoading(false)
      return setMsg({ text: '⚠️ Invalid Email format (must contain @ and .)', type: 'error' })
    }

    try {
      let res;
      if (userEditing?.id_usuario) {
        // 💡 MODO EDICIÓN: Usamos updateUser
        res = await userService.updateUser(userEditing.id_usuario, userData)
      } else {
        // 💡 MODO CREACIÓN: Usamos createUser
        res = await userService.createUser(userData)
      }

      if (res.error) throw res.error

      setMsg({ 
        text: userEditing ? '✨ User updated successfully' : '✨ User created successfully', 
        type: 'success' 
      })
      
      currentForm.reset()
      onUserCreated() // Refrescamos la lista
      if (userEditing) onCancelEdit() // Salimos del modo edición si corresponde
      
    } catch (err: any) {
      setMsg({ text: `⚠️ Database Error: ${err.message}`, type: 'error' })
    } finally {
      setLoading(false) 
    }
  }

  return (
    <div className="bg-black/90 backdrop-blur-lg p-10 rounded-[32px] border border-zinc-800 shadow-2xl">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
          {userEditing ? 'Edit User' : 'New User'}
        </h2>
        <div className="h-1 w-12 bg-yellow-400 mx-auto mt-2 rounded-full"></div>
        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-4">
          {userEditing ? 'Update profile information' : 'System Registration'}
        </p>
      </div>
      
      <form key={userEditing?.id_usuario || 'new'} onSubmit={handleSubmit} className="space-y-5">
        
        {/* DNI: Locked if editing */}
        <div className="group space-y-1">
          <label className="text-[10px] font-bold text-zinc-500 uppercase ml-2 group-focus-within:text-yellow-400 transition-colors">
            DNI {userEditing && '(Locked)'}
          </label>
          <input 
            name="dni" 
            required 
            defaultValue={userEditing?.dni} 
            readOnly={!!userEditing} // 💡 REGLA: No se edita el DNI
            placeholder="Numbers only"
            className={`w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-white outline-none transition-all ${
              userEditing ? 'opacity-30 cursor-not-allowed border-transparent' : 'focus:border-yellow-400'
            }`} 
          />
        </div>

        {/* Name & Lastname Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="group space-y-1">
            <label className="text-[10px] font-bold text-zinc-500 uppercase ml-2">First Name</label>
            <input 
              name="nombre" 
              required 
              defaultValue={userEditing?.nombre} 
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-white focus:border-yellow-400 outline-none transition-all" 
            />
          </div>
          <div className="group space-y-1">
            <label className="text-[10px] font-bold text-zinc-500 uppercase ml-2">Last Name</label>
            <input 
              name="apellido" 
              required 
              defaultValue={userEditing?.apellido} 
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-white focus:border-yellow-400 outline-none transition-all" 
            />
          </div>
        </div>

        {/* Email */}
        <div className="group space-y-1">
          <label className="text-[10px] font-bold text-zinc-500 uppercase ml-2">Email</label>
          <input 
            name="email" 
            type="email" 
            required 
            defaultValue={userEditing?.email} 
            placeholder="example@unne.edu.ar"
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-white focus:border-yellow-400 outline-none transition-all" 
          />
        </div>

        {/* Role Selector */}
        <div className="group space-y-1 pb-2">
          <label className="text-[10px] font-bold text-zinc-500 uppercase ml-2">Access Role</label>
          <div className="relative">
            <select 
              name="rol" 
              defaultValue={userEditing?.rol || 'estudiante'} 
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-white focus:border-yellow-400 outline-none appearance-none cursor-pointer"
            >
              <option value="estudiante">Student</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={loading} 
          className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-black py-5 rounded-2xl transition-all shadow-lg shadow-yellow-400/10 active:scale-95 disabled:opacity-50"
        >
          {loading ? 'PROCESSING...' : userEditing ? 'SAVE CHANGES' : 'CREATE USER'}
        </button>

        {userEditing && (
          <button 
            type="button" 
            onClick={onCancelEdit} 
            className="w-full text-zinc-600 text-[10px] font-bold uppercase mt-2 hover:text-white transition-colors"
          >
            Cancel Edition
          </button>
        )}
      </form>

      {/* Messages */}
      {msg.text && (
        <div className={`mt-8 p-4 rounded-2xl text-[10px] font-bold text-center border animate-in fade-in slide-in-from-bottom-2 ${
          msg.type === 'error' ? 'bg-red-500/5 text-red-500 border-red-500/10' : 'bg-yellow-400/5 text-yellow-400 border-yellow-400/10'
        }`}>
          {msg.text}
        </div>
      )}
    </div>
  )
}