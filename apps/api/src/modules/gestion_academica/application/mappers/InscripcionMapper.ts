import { Inscripcion } from '../../domain/entities/Inscripcion';
import { InscripcionResponseDto } from '../dto/inscripcion-response.dto';

export class InscripcionMapper {
    static toDomain(raw: any): Inscripcion {
        return new Inscripcion(
            raw.id_inscripcion,
            raw.estado,
            raw.fecha_inscripcion ?? null,
            raw.id_comision,
            raw.id_usuario,
            raw.comision?.nombre_comision ?? null,
            raw.comision?.asignatura?.nombre_asignatura ?? null,
        );
    }

    static toDto(entity: Inscripcion): InscripcionResponseDto {
        const dto = new InscripcionResponseDto();
        dto.id_inscripcion    = entity.id;
        dto.estado            = entity.estado;
        dto.fecha_inscripcion = entity.fechaInscripcion;
        dto.id_comision       = entity.idComision;
        dto.id_usuario        = entity.idUsuario;
        dto.nombre_comision   = entity.nombreComision;
        dto.nombre_asignatura = entity.nombreAsignatura;
        return dto;
    }
}
