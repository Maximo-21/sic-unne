import { supabase } from './supabase'
import { Usuario } from '@/types/user'

export const authService = {
  // INICIAR SESIÓN: Valida credenciales contra la base de datos
  iniciarSesion: async (dni: string, clave: string) => {
    
    // 🚀 Llamamos a la función RPC (Procedimiento Almacenado) de Supabase
    // Nota: 'verificar_login' es el nombre en el SQL Editor
    const { data, error } = await supabase.rpc('verificar_login', {
      p_dni: dni,
      p_pass: clave
    })

    // Como el RPC devuelve una lista, tomamos el primer resultado (si existe)
    const usuario = data && data.length > 0 ? data[0] : null;

    if (!usuario && !error) {
      return { 
        data: null, 
        error: { message: 'DNI o Contraseña incorrectos' } 
      }
    }

    if (usuario && usuario.estado === 'inactivo') {
      return { 
      data: null, 
      error: { message: 'Tu cuenta está desactivada. Contactá con el administrador.' } 
    }
  }

    // Retornamos el usuario mapeado al tipo User
    return { data: usuario as Usuario | null, error }
  }
}