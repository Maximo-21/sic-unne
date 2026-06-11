import { Usuario } from '../../domain/entities/Usuario';
import { Rol }     from '../../domain/entities/Rol';
import { UsuarioResponseDto } from '../dto/UsuarioResponseDto';

export class UsuarioMapper {
    static toDomain(raw: any): Usuario {
        const rol = raw.rol
            ? new Rol(raw.rol.id_rol, raw.rol.descripcion)
            : null;

        return new Usuario(
            raw.id_usuario,
            raw.dni,
            raw.nombre,
            raw.apellido,
            raw.email,
            raw.contrasena,
            raw.carrera,
            raw.id_rol,
            rol,
            raw.estado,
            raw.fecha_registro,
        );
    }

    static toDto(entity: Usuario): UsuarioResponseDto {
        const dto = new UsuarioResponseDto();
        dto.id_usuario      = entity.id;
        dto.dni             = entity.dni;
        dto.nombre          = entity.nombre;
        dto.apellido        = entity.apellido;
        dto.email           = entity.email;
        dto.carrera         = entity.carrera;
        dto.rol_descripcion = entity.rol?.descripcion ?? null;
        dto.estado          = entity.estado;
        dto.fecha_registro  = entity.fechaRegistro;
        return dto;
    }
}
