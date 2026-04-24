import { supabase } from './supabase'
import { Usuario } from '@/types/user'

export const userService = {
  // LEER: Traer todos los usuarios ordenados por fecha
  obtenerUsuarios: async () => {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .order('fecha_registro', { ascending: false })
    return { data, error }
  },

  // CREAR: Guardar un nuevo registro
  crearUsuario: async (datosUsuario: Omit<Usuario, 'id_usuario' | 'fecha_registro'>) => {
    const { data, error } = await supabase
      .from('usuarios')
      .insert([datosUsuario]) // Supabase espera un array de objetos
      .select()
      .single() // Esto nos devuelve el objeto creado directamente en 'data'
    
    // Devolvemos el error tal cual viene de Supabase (con su código 23505 si falla)
    return { data, error }
  },

  // ACTUALIZAR: Método genérico para actualizar cualquier campo
  actualizarUsuario: async (idUsuario: string | number, cambios: Partial<Usuario>) => {
    const { data, error } = await supabase
      .from('usuarios')
      .update(cambios)
      .eq('id_usuario', idUsuario)
      .select()
      .single()
      
    return { data, error }
  },

  // BAJA LÓGICA: Cambiar estado a 'inactivo'
  desactivarUsuario: async (idUsuario: string | number) => {
    return await userService.actualizarUsuario(idUsuario, { estado: 'inactivo' })
  },

  // REACTIVAR: Cambiar estado a 'activo'
  activarUsuario: async (idUsuario: string | number) => {
    return await userService.actualizarUsuario(idUsuario, { estado: 'activo' })
  }
}