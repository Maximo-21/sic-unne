export class Rol {
    constructor(
        public readonly id:          number,
        public readonly descripcion: string,
    ) { }

    esEstudiante(): boolean {
        return this.descripcion === 'estudiante';
    }

    esAdministrador(): boolean {
        return this.descripcion === 'admin';
    }
}
