import { Usuario } from '../types/Usuario';

export class UsuariosServicio {
  // Ajustá el puerto según lo que use tu NestJS (normalmente 3001 o 3000)
  private static readonly API_URL = 'http://localhost:3001/usuarios';

  // LEER TODOS
  static async obtenerTodos(): Promise<Usuario[]> {
    const respuesta = await fetch(this.API_URL);
    if (!respuesta.ok) throw new Error('Error al obtener usuarios');
    return await respuesta.json();
  }

  // BUSCAR POR DNI
  static async obtenerPorDni(dni: string): Promise<Usuario> {
    const respuesta = await fetch(`${this.API_URL}/${dni}`);
    if (!respuesta.ok) throw new Error('Usuario no encontrado');
    const resultado = await respuesta.json();
    return resultado.data; // Según el formato que pusimos en el controlador
  }

  // CREAR
  static async crear(u: Omit<Usuario, 'id_usuario' | 'fecha_registro'>) {
    const respuesta = await fetch(this.API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(u)
    });

    // Si NestJS rebota la petición (DNI duplicado, error de validación, etc.)
    if (!respuesta.ok) {
      const errorData = await respuesta.json();
      // Lanzamos el error con el mensaje específico que configuró tu compañero
      throw new Error(errorData.message || 'Error al crear el usuario');
    }

    return await respuesta.json();
  }

  // ACTUALIZAR
  static async actualizar(id: string, datos: Partial<Usuario>) {
    const respuesta = await fetch(`${this.API_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });

    if (!respuesta.ok) {
      const errorData = await respuesta.json();
      throw new Error(errorData.message || 'Error al actualizar el usuario');
    }

    return await respuesta.json();
  }

  // BAJA LÓGICA (PATCH porque solo cambia el estado)
  static async darDeBaja(id: string) {
    const respuesta = await fetch(`${this.API_URL}/${id}/desactivar`, {
      method: 'PATCH'
    });
    return await respuesta.json();
  }

  // REACTIVAR
  static async activar(id: string) {
    const respuesta = await fetch(`${this.API_URL}/${id}/activar`, {
      method: 'PATCH'
    });
    return await respuesta.json();
  }
}