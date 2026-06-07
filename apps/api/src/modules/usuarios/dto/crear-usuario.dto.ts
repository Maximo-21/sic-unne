export class CrearUsuarioDto {
    readonly dni!: string;
    readonly nombre!: string;
    readonly apellido!: string;
    readonly email!: string;
    readonly contrasena!: string; // Sin 'ñ' para coincidir con la base de datos
    readonly rol!: 'estudiante' | 'admin';
}