import { IsString, IsEmail, IsInt, IsOptional } from 'class-validator';

/** DTO para la actualización parcial de un usuario (todos los campos son opcionales). */
export class ActualizarUsuarioDto {
    @IsOptional()
    @IsString()
    readonly nombre?: string;

    @IsOptional()
    @IsString()
    readonly apellido?: string;

    @IsOptional()
    @IsEmail({}, { message: 'El email debe tener un formato válido.' })
    readonly email?: string;

    @IsOptional()
    @IsString()
    readonly carrera?: string;

    @IsOptional()
    @IsInt({ message: 'El rol debe ser un número entero.' })
    readonly idRol?: number;
}
