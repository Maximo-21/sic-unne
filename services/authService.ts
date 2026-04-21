import { supabase } from './supabase'
import { User } from '@/types/user'

export const authService = {
  login: async (dni: string, pass: string) => {
    // 🚀 Llamamos a la función RPC que creamos en el SQL Editor
    const { data, error } = await supabase.rpc('verificar_login', {
      p_dni: dni,
      p_pass: pass
    })

    // Como RPC devuelve una lista, tomamos el primer resultado (si existe)
    const user = data && data.length > 0 ? data[0] : null;

    if (!user && !error) {
      return { data: null, error: { message: 'DNI o Contraseña incorrectos' } }
    }

    return { data: user as User | null, error }
  }
}