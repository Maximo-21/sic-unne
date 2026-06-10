import { Usuario } from '@/modules/usuarios/types/Usuario';
import { guardarUsuario } from '@shared/utils/sesion';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const AutenticacionServicio = {
  iniciarSesion: async (dni: string, clave: string) => {
    try {
      const respuesta = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dni, clave })
      });

      if (!respuesta.ok) {
        const errorData = await respuesta.json();
        return {
          data: null,
          error: { message: errorData.message || 'DNI o Contraseña incorrectos' }
        };
      }

      const { data: usuario } = await respuesta.json();
      guardarUsuario(usuario);
      return { data: usuario as Usuario, error: null };

    } catch {
      return { data: null, error: { message: 'Error de conexión con el servidor' } };
    }
  }
};
