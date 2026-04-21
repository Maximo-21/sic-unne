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
  
  // 1. Armamos el objeto base (sin el DNI por ahora)
  const userData: any = {
    nombre: formData.get('nombre') as string,
    apellido: formData.get('apellido') as string,
    email: formData.get('email') as string,
    rol: formData.get('rol') as 'estudiante' | 'admin',
    contraseña: formData.get('contraseña') as string,
    estado: userEditing?.estado || 'activo'
  }

  // 2. Definimos qué DNI vamos a validar
  const dniToValidate = userEditing ? userEditing.dni : (formData.get('dni') as string) || '';

  // --- 🛡️ ZONA DE VALIDACIONES ---

  // Validar que no haya nada vacío
  if (!userSchema.validateRequired({ ...userData, dni: dniToValidate })) {
    setLoading(false);
    return setMsg({ text: '⚠️ Todos los campos son obligatorios', type: 'error' });
  }

  // Validar DNI (Solo si es nuevo, porque si editamos es readOnly)
  if (!userEditing && !userSchema.validateDNI(dniToValidate)) {
    setLoading(false);
    return setMsg({ text: '⚠️ DNI inválido (7 a 9 números)', type: 'error' });
  }

  // Validar Nombre y Apellido (Sin números)
  if (!userSchema.validateName(userData.nombre) || !userSchema.validateName(userData.apellido)) {
    setLoading(false);
    return setMsg({ text: '⚠️ El nombre/apellido solo puede contener letras', type: 'error' });
  }

  // Validar Email (Cualquier correo con @ y .)
  if (!userSchema.validateEmail(userData.email)) {
    setLoading(false);
    return setMsg({ text: '⚠️ Formato de correo inválido', type: 'error' });
  }

    // AHORA SÍ: El DNI solo lo agregamos al objeto final si es un usuario NUEVO
  if (!userEditing) {
  userData.dni = dniToValidate; // ✅ Usamos el dato que ya validamos arriba
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
      
      {/* 1. DNI: Bloquea letras y símbolos */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-black text-zinc-400 uppercase ml-1">DNI del Usuario</label>
        <input 
          name="dni" 
          required 
          defaultValue={userEditing?.dni} 
          readOnly={!!userEditing}
          onInput={(e) => {
            // 🚫 Borra todo lo que no sea un número del 0 al 9
            e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '');
          }}
          className={`w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:border-primary-unne outline-none transition-all ${
            userEditing ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed' : 'bg-white'
          }`} 
          placeholder="Ej: 42123456"
          maxLength={9}
        />
      </div>

      {/* 2. NOMBRE Y APELLIDO: Bloquea números */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-zinc-400 uppercase ml-1">Nombre</label>
          <input 
            name="nombre" 
            defaultValue={userEditing?.nombre} 
            required
            onInput={(e) => {
              // 🚫 Borra números y símbolos, permite letras, espacios y tildes
              e.currentTarget.value = e.currentTarget.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, '');
            }}
            className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:border-primary-unne outline-none" 
            placeholder="Juan" 
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-zinc-400 uppercase ml-1">Apellido</label>
          <input 
            name="apellido" 
            defaultValue={userEditing?.apellido} 
            required
            onInput={(e) => {
              e.currentTarget.value = e.currentTarget.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, '');
            }}
            className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:border-primary-unne outline-none" 
            placeholder="Pérez" 
          />
        </div>
      </div>

      {/* 3. EMAIL: Valida formato @ y . */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-black text-zinc-400 uppercase ml-1">Correo Electrónico</label>
        <input 
          name="email" 
          type="email" 
          defaultValue={userEditing?.email} 
          required
          className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:border-primary-unne outline-none" 
          placeholder="ejemplo@correo.com" 
        />
      </div>

      {/* 4. CONTRASEÑA: Bloqueada en edición */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-black text-zinc-400 uppercase ml-1">
          {userEditing ? 'Contraseña (Protegida por Hash)' : 'Contraseña de Acceso'}
        </label>
        <div className="relative group">
          <input 
            name="contraseña" 
            type="text" 
            defaultValue={userEditing?.contraseña} 
            readOnly={!!userEditing} 
            required={!userEditing}
            placeholder={userEditing ? "" : "Mínimo 6 caracteres"}
            className={`w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm outline-none transition-all 
              ${userEditing 
                ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed font-mono text-[10px]' 
                : 'bg-white focus:border-primary-unne focus:ring-4 focus:ring-primary-unne/5'
              }`} 
          />
          {userEditing && (
            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-zinc-300 text-sm">
              lock
            </span>
          )}
        </div>
      </div>

      {/* 5. NIVEL DE ACCESO */}
      <div className="space-y-1.5 pb-2">
        <label className="text-[10px] font-black text-zinc-400 uppercase ml-1">Nivel de Acceso</label>
        <select name="rol" defaultValue={userEditing?.rol || 'estudiante'} className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:border-primary-unne outline-none bg-white cursor-pointer">
          <option value="estudiante">Estudiante</option>
          <option value="admin">Administrador</option>
        </select>
      </div>

      {/* 6. BOTONES DE ACCIÓN */}
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