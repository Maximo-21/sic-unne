import { Usuario } from '../domain/entities/Usuario';

export class UsuarioResponseDto {
    id_usuario!: string;
    dni!: string;
    nombre!: string;
    apellido!: string;
    email!: string;
    rol!: string;
    estado!: string;
    fecha_registro!: Date;

    // Mapeador corregido según la entidad real de tu dominio
    static desdeEntidad(usuario: any): UsuarioResponseDto {
        const dto = new UsuarioResponseDto();
        // Usamos 'id' o lo que tenga la entidad (le ponemos 'any' temporal al parámetro para evitar que TypeScript se queje mientras mapeamos)
        dto.id_usuario = usuario.id || usuario.id_usuario; 
        dto.dni = usuario.dni;
        dto.nombre = usuario.nombre;
        dto.apellido = usuario.apellido;
        dto.email = usuario.email;
        dto.rol = usuario.rol;
        dto.estado = usuario.estado;
        dto.fecha_registro = usuario.fechaRegistro || usuario.fecha_registro; 
        return dto;
    }
}