export interface Usuario {
  id_usuario?: string;
  dni: string;
  nombre: string;
  apellido: string;
  email: string;
  carrera?: string | null;
  rol_descripcion?: string | null;
  estado?: string | null;
  fecha_registro?: string | null;
}