import { Usuario } from '../types/Usuario';

export class UsuariosServicio {
  private static readonly API_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/usuarios`;

  // LEER TODOS
  static async obtenerTodos(): Promise<Usuario[]> {
    const respuesta = await fetch(this.API_URL);
    if (!respuesta.ok) throw new Error('Error al obtener usuarios');
    const { data } = await respuesta.json();
    return data;
  }

  // BUSCAR POR DNI
  static async obtenerPorDni(dni: string): Promise<Usuario> {
    const respuesta = await fetch(`${this.API_URL}/${dni}`);
    if (!respuesta.ok) throw new Error('Usuario no encontrado');
    const { data } = await respuesta.json();
    return data;
  }

  // CREAR
  static async crear(u: any) {
    const respuesta = await fetch(this.API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(u)
    });

    if (!respuesta.ok) {
      const errorData = await respuesta.json();
      throw new Error(errorData.message || 'Error al crear el usuario');
    }

    const { data } = await respuesta.json();
    return data;
  }

  // ACTUALIZAR
  static async actualizar(id: string, datos: any) {
    const respuesta = await fetch(`${this.API_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });

    if (!respuesta.ok) {
      const errorData = await respuesta.json();
      throw new Error(errorData.message || 'Error al actualizar el usuario');
    }

    const { data } = await respuesta.json();
    return data;
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