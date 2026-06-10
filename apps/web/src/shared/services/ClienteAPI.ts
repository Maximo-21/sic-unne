import { obtenerIdUsuario } from '../utils/sesion';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

function manejarNoAutorizado(): never {
  if (typeof window !== 'undefined') {
    window.location.href = '/';
  }
  throw new Error('No autorizado');
}

function construirEncabezados(incluirUserId: boolean = true): HeadersInit {
  const encabezados: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (incluirUserId) {
    const idUsuario = obtenerIdUsuario();
    if (idUsuario) {
      encabezados['x-user-id'] = idUsuario;
    }
  }

  return encabezados;
}

async function obtener<T>(ruta: string): Promise<T> {
  const respuesta = await fetch(`${API_BASE_URL}${ruta}`, {
    method: 'GET',
    headers: construirEncabezados(),
  });

  if (respuesta.status === 401 || respuesta.status === 403) {
    return manejarNoAutorizado();
  }

  if (!respuesta.ok) {
    const error = await respuesta.json().catch(() => ({}));
    throw new Error((error as any).message || `Error ${respuesta.status}`);
  }

  return respuesta.json();
}

async function post<T>(ruta: string, cuerpo: unknown, incluirUserId: boolean = true): Promise<T> {
  const respuesta = await fetch(`${API_BASE_URL}${ruta}`, {
    method: 'POST',
    headers: construirEncabezados(incluirUserId),
    body: JSON.stringify(cuerpo),
  });

  if (respuesta.status === 401 || respuesta.status === 403) {
    return manejarNoAutorizado();
  }

  if (!respuesta.ok) {
    const error = await respuesta.json().catch(() => ({}));
    throw new Error((error as any).message || `Error ${respuesta.status}`);
  }

  return respuesta.json();
}

async function patch<T>(ruta: string, cuerpo: unknown): Promise<T> {
  const respuesta = await fetch(`${API_BASE_URL}${ruta}`, {
    method: 'PATCH',
    headers: construirEncabezados(),
    body: JSON.stringify(cuerpo),
  });

  if (respuesta.status === 401 || respuesta.status === 403) {
    return manejarNoAutorizado();
  }

  if (!respuesta.ok) {
    const error = await respuesta.json().catch(() => ({}));
    throw new Error((error as any).message || `Error ${respuesta.status}`);
  }

  return respuesta.json();
}

async function eliminar<T = void>(ruta: string): Promise<T> {
  const respuesta = await fetch(`${API_BASE_URL}${ruta}`, {
    method: 'DELETE',
    headers: construirEncabezados(),
  });

  if (respuesta.status === 401 || respuesta.status === 403) {
    return manejarNoAutorizado();
  }

  if (!respuesta.ok) {
    const error = await respuesta.json().catch(() => ({}));
    throw new Error((error as any).message || `Error ${respuesta.status}`);
  }

  const texto = await respuesta.text();
  return (texto ? JSON.parse(texto) : undefined) as T;
}

export const clienteAPI = { obtener, post, patch, eliminar };
