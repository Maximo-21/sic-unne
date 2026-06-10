import { SolicitudIntercambioResponseDto } from './solicitud-intercambio-response.dto';

export class PropuestaResponseDto {
    id_propuesta!:    number;
    estado_general!:  string;
    estado_alumno_1!: string;
    estado_alumno_2!: string;
    fecha_match!:     Date | null;
    id_solicitud_1!:  number;
    id_solicitud_2!:  number;
    solicitud1!:      SolicitudIntercambioResponseDto | null;
    solicitud2!:      SolicitudIntercambioResponseDto | null;
}
