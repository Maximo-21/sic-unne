export class CrearUsuarioDto {
    readonly dni!:       string;
    readonly nombre!:    string;
    readonly apellido!:  string;
    readonly email!:     string;
    readonly contrasena!: string;
    readonly carrera?:   string;
    readonly idRol!:     number;
}
