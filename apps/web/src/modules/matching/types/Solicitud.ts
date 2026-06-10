export interface Solicitud {
  id_solicitud: number;
  estado: string;
  fecha_creacion: string | null;
  id_usuario: string;
  id_comision_origen: number;
  id_comision_destino: number;
  id_asignatura_origen: number | null;
  nombre_usuario: string | null;
  apellido_usuario: string | null;
  nombre_comision_origen: string | null;
  nombre_comision_destino: string | null;
  nombre_asignatura_origen: string | null;
}
