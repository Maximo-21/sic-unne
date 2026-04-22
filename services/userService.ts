import { supabase } from './supabase'
import { User } from '@/types/user'

export const userService = {
  // READ: Traer todos los usuarios ordenados por fecha
  fetchUsers: async () => {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .order('fecha_registro', { ascending: false })
    return { data, error }
  },

  // CREATE: Guardar un nuevo registro
  createUser: async (userData: Omit<User, 'id_usuario' | 'fecha_registro'>) => {
    const { data, error } = await supabase
      .from('usuarios')
      .insert([userData]) // Supabase espera un array de objetos
      .select()
      .single() // Esto nos devuelve el objeto creado directamente en 'data'
    
    // Devolvemos el error tal cual viene de Supabase (con su código 23505 si falla)
    return { data, error }
  },

  // UPDATE: Método genérico para actualizar cualquier campo
  updateUser: async (userId: string | number, changes: Partial<User>) => {
    const { data, error } = await supabase
      .from('usuarios')
      .update(changes)
      .eq('id_usuario', userId)
      .select()
      .single()
      
    return { data, error }
  },

  // LOGICAL DELETE: Cambiar estado a 'inactivo'
  deactivateUser: async (userId: string | number) => {
    return await userService.updateUser(userId, { estado: 'inactivo' })
  },

  // REACTIVATE: Cambiar estado a 'activo'
  activateUser: async (userId: string | number) => {
    return await userService.updateUser(userId, { estado: 'activo' })
  }
}