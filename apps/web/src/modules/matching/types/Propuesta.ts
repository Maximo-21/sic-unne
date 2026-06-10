import { Solicitud } from './Solicitud';

export interface Propuesta {
  id_propuesta: number;
  estado_general: string;
  estado_alumno_1: string;
  estado_alumno_2: string;
  fecha_match: string | null;
  id_solicitud_1: number;
  id_solicitud_2: number;
  solicitud1: Solicitud | null;
  solicitud2: Solicitud | null;
}
