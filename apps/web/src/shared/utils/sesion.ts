import { Usuario } from '@/modules/usuarios/types/Usuario';

export function obtenerUsuarioActual(): Usuario | null {
  if (typeof window === 'undefined') return null;
  const usuario = localStorage.getItem('usuario_sic');
  return usuario ? JSON.parse(usuario) : null;
}

export function obtenerIdUsuario(): string | null {
  if (typeof window === 'undefined') return null;
  return obtenerUsuarioActual()?.id_usuario || null;
}

export function guardarUsuario(usuario: any): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('usuario_sic', JSON.stringify(usuario));
  document.cookie = `sesion_sic=${usuario.id_usuario}; path=/; max-age=${7 * 24 * 60 * 60}`;
}

export function limpiarSesion(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('usuario_sic');
  document.cookie = 'sesion_sic=; path=/; max-age=0';
}
