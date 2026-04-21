import { supabase } from './supabase'
import { User } from '@/types/user'

export const authService = {
  login: async (dni: string, pass: string) => {
    // Buscamos al usuario que coincida en ambos campos
    const { data, error } = await supabase
      .from('Usuario')
      .select('*')
      .eq('dni', dni)
      .eq('contraseña', pass)
      .single() // Esperamos un solo resultado

    return { data: data as User | null, error }
  }
}