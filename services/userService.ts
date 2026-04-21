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
      .insert([userData])
      .select()
    return { data, error }
  },

  // UPDATE: Método genérico para actualizar cualquier campo
  updateUser: async (userId: string, changes: Partial<User>) => {
    const { data, error } = await supabase
      .from('usuarios')
      .update(changes)
      .eq('id_usuario', userId) // 💡 id_usuario es tu PK en la foto
      .select()
    return { data, error }
  },

  // LOGICAL DELETE: Cambiar estado a 'inactivo'
  deactivateUser: async (userId: string) => {
    // Reutilizamos updateUser para mantener la consistencia
    return await userService.updateUser(userId, { estado: 'inactivo' })
  },

  // REACTIVATE: Cambiar estado a 'activo'
  activateUser: async (userId: string) => {
    return await userService.updateUser(userId, { estado: 'activo' })
  }
}