import { Usuario } from '../types/Usuario';
import { clienteAPI } from '@shared/services/ClienteAPI';

export class UsuariosServicio {
  static async obtenerTodos(): Promise<Usuario[]> {
    const respuesta = await clienteAPI.obtener<{ data: Usuario[] }>('/usuarios');
    return respuesta.data;
  }

  static async obtenerPorDni(dni: string): Promise<Usuario> {
    const respuesta = await clienteAPI.obtener<{ data: Usuario }>(`/usuarios/${dni}`);
    return respuesta.data;
  }

  static async crear(u: unknown) {
    const respuesta = await clienteAPI.post<{ data: Usuario }>('/usuarios', u);
    return respuesta.data;
  }

  static async actualizar(id: string, datos: unknown) {
    const respuesta = await clienteAPI.patch<{ data: Usuario }>(`/usuarios/${id}`, datos);
    return respuesta.data;
  }

  static async darDeBaja(id: string) {
    return clienteAPI.patch<{ status: string; message: string }>(`/usuarios/${id}/desactivar`, {});
  }

  static async activar(id: string) {
    return clienteAPI.patch<{ status: string; message: string }>(`/usuarios/${id}/activar`, {});
  }
}
