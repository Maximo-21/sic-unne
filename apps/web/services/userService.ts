import { supabase } from './supabase'
import { Usuario } from '@/types/user'

export const userService = {
  // LEER: Llama a la función que devuelve usuarios ordenados y sin contraseña
  obtenerUsuarios: async () => {
    return await supabase.rpc('fn_obtener_usuarios');
  },

  // CREAR: Mapeamos los datos del formulario a los parámetros de la función SQL
  crearUsuario: async (u: Omit<Usuario, 'id_usuario' | 'fecha_registro'>) => {
    return await supabase.rpc('fn_crear_usuario', {
      p_dni: u.dni,
      p_nombre: u.nombre,
      p_apellido: u.apellido,
      p_email: u.email,
      p_clave: u.contraseña,
      p_rol: u.rol
    });
  },

  // ACTUALIZAR: Enviamos los datos específicos a la Capa de Negocio
  actualizarUsuario: async (id: string, datos: Partial<Usuario>) => {
    return await supabase.rpc('fn_actualizar_usuario', {
      p_id: id,
      p_nombre: datos.nombre,
      p_apellido: datos.apellido,
      p_email: datos.email,
      p_rol: datos.rol
    });
  },

  // BAJA LÓGICA: Usamos la función genérica de cambio de estado
  desactivarUsuario: async (id: string) => {
    return await supabase.rpc('fn_cambiar_estado_usuario', { 
      p_id: id, 
      p_nuevo_estado: 'inactivo' 
    });
  },

  // REACTIVAR: La misma función pero con estado 'activo'
  activarUsuario: async (id: string) => {
    return await supabase.rpc('fn_cambiar_estado_usuario', { 
      p_id: id, 
      p_nuevo_estado: 'activo' 
    });
  }
}