export class Usuario {
    constructor(
        public readonly id:             string,
        public readonly dni:            string,
        public readonly nombre:         string,
        public readonly apellido:       string,
        public readonly email:          string,
        public readonly contraseña:     string,
        public readonly carrera:        string | null,
        public readonly idRol:          number,
        public readonly rolDescripcion: string | null,
        public readonly estado:         string | null,
        public readonly fechaRegistro:  Date | null,
    ) { }

    obtenerNombreCompleto(): string {
        return `${this.nombre} ${this.apellido}`;
    }

    esEstudiante(): boolean {
        return this.rolDescripcion === 'estudiante';
    }

    esAdministrador(): boolean {
        return this.rolDescripcion === 'admin';
    }
}
