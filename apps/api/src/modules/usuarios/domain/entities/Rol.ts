/**
 * Value Object que representa el rol de un usuario en el sistema.
 *
 * Valores válidos de `descripcion`: `'estudiante'` | `'admin'`.
 * Los guards de NestJS (`EstudianteGuard`, `AdminGuard`) delegan en estos métodos.
 */
export class Rol {
    constructor(
        public readonly id:          number,
        public readonly descripcion: string,
    ) { }

    /** `true` si el rol corresponde a un alumno de la institución. */
    esEstudiante(): boolean {
        return this.descripcion === 'estudiante';
    }

    /** `true` si el rol corresponde a un administrador con acceso total. */
    esAdministrador(): boolean {
        return this.descripcion === 'admin';
    }
}
