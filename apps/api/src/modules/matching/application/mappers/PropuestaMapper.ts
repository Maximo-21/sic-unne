import { Propuesta } from '../../domain/entities/Propuesta';
import { PropuestaResponseDto } from '../dto/PropuestaResponseDto';
import { SolicitudIntercambioMapper } from './SolicitudIntercambioMapper';

export class PropuestaMapper {

    static toDomain(raw: any): Propuesta {
        return new Propuesta(
            raw.id_propuesta,
            raw.estado_general,
            raw.estado_alumno_1,
            raw.estado_alumno_2,
            raw.fecha_match      ?? null,
            raw.id_solicitud_1,
            raw.id_solicitud_2,
            raw.solicitud_1 ? SolicitudIntercambioMapper.toDomain(raw.solicitud_1) : null,
            raw.solicitud_2 ? SolicitudIntercambioMapper.toDomain(raw.solicitud_2) : null,
        );
    }

    static toDto(entity: Propuesta): PropuestaResponseDto {
        const dto = new PropuestaResponseDto();
        dto.id_propuesta    = entity.id;
        dto.estado_general  = entity.estadoGeneral;
        dto.estado_alumno_1 = entity.estadoAlumno1;
        dto.estado_alumno_2 = entity.estadoAlumno2;
        dto.fecha_match     = entity.fechaMatch;
        dto.id_solicitud_1  = entity.idSolicitud1;
        dto.id_solicitud_2  = entity.idSolicitud2;
        dto.solicitud1      = entity.solicitud1 ? SolicitudIntercambioMapper.toDto(entity.solicitud1) : null;
        dto.solicitud2      = entity.solicitud2 ? SolicitudIntercambioMapper.toDto(entity.solicitud2) : null;
        return dto;
    }
}
