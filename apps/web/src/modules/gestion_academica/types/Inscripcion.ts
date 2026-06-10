export interface Inscripcion {
  id_inscripcion: number;
  estado: string;
  fecha_inscripcion: string | null;
  id_comision: number;
  id_usuario: string;
  nombre_comision: string | null;
  nombre_asignatura: string | null;
}
