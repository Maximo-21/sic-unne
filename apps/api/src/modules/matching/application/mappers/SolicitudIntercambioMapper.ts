import { SolicitudIntercambio } from '../../domain/entities/SolicitudIntercambio';
import { SolicitudIntercambioResponseDto } from '../dto/SolicitudIntercambioResponseDto';

export class SolicitudIntercambioMapper {

    static toDomain(raw: any): SolicitudIntercambio {
        return new SolicitudIntercambio(
            raw.id_solicitud,
            raw.estado,
            raw.fecha_creacion                                    ?? null,
            raw.id_usuario,
            raw.id_comision_origen,
            raw.id_comision_destino,
            raw.comision_origen?.asignatura?.id_asignatura        ?? null,
            raw.usuario?.nombre                                   ?? null,
            raw.usuario?.apellido                                 ?? null,
            raw.comision_origen?.nombre_comision                  ?? null,
            raw.comision_destino?.nombre_comision                 ?? null,
            raw.comision_origen?.asignatura?.nombre_asignatura    ?? null,
        );
    }

    static toDto(entity: SolicitudIntercambio): SolicitudIntercambioResponseDto {
        const dto = new SolicitudIntercambioResponseDto();
        dto.id_solicitud              = entity.id;
        dto.estado                    = entity.estado;
        dto.fecha_creacion            = entity.fechaCreacion;
        dto.id_usuario                = entity.idUsuario;
        dto.id_comision_origen        = entity.idComisionOrigen;
        dto.id_comision_destino       = entity.idComisionDestino;
        dto.id_asignatura_origen      = entity.idAsignaturaOrigen;
        dto.nombre_usuario            = entity.nombreUsuario;
        dto.apellido_usuario          = entity.apellidoUsuario;
        dto.nombre_comision_origen    = entity.nombreComisionOrigen;
        dto.nombre_comision_destino   = entity.nombreComisionDestino;
        dto.nombre_asignatura_origen  = entity.nombreAsignaturaOrigen;
        return dto;
    }
}
