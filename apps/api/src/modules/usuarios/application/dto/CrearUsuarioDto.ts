import { IsString, IsEmail, IsNotEmpty, IsInt, IsOptional, MinLength } from 'class-validator';

export class CrearUsuarioDto {
    @IsString()
    @IsNotEmpty({ message: 'El DNI es obligatorio.' })
    readonly dni!: string;

    @IsString()
    @IsNotEmpty({ message: 'El nombre es obligatorio.' })
    readonly nombre!: string;

    @IsString()
    @IsNotEmpty({ message: 'El apellido es obligatorio.' })
    readonly apellido!: string;

    @IsEmail({}, { message: 'El email debe tener un formato válido.' })
    @IsNotEmpty({ message: 'El email es obligatorio.' })
    readonly email!: string;

    @IsString()
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
    @IsNotEmpty({ message: 'La contraseña es obligatoria.' })
    readonly contrasena!: string;

    @IsString()
    @IsOptional()
    readonly carrera?: string;

    @IsInt({ message: 'El rol debe ser un número entero.' })
    @IsNotEmpty({ message: 'El rol es obligatorio.' })
    readonly idRol!: number;
}
