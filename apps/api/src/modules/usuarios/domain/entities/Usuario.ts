import { Rol } from './Rol';

/**
 * Entidad de dominio que representa a un usuario del sistema SIC-UNNE.
 *
 * Los estados posibles son `'activo'` e `'inactivo'`. Un usuario inactivo
 * no puede autenticarse ni ser modificado (ver contrato `actualizarUsuario`).
 *
 * La contraseña almacenada siempre está hasheada con bcrypt; nunca se expone en texto plano.
 */
export class Usuario {
    constructor(
        public readonly id:            string,
        public readonly dni:           string,
        public readonly nombre:        string,
        public readonly apellido:      string,
        public readonly email:         string,
        public readonly contraseña:    string,
        public readonly carrera:       string | null,
        public readonly idRol:         number,
        public readonly rol:           Rol | null,
        public readonly estado:        string | null,
        public readonly fechaRegistro: Date | null,
    ) { }

    /** Retorna nombre y apellido concatenados. */
    obtenerNombreCompleto(): string {
        return `${this.nombre} ${this.apellido}`;
    }

    /** `true` si el rol del usuario es `'estudiante'`. Requiere que `rol` esté cargado. */
    esEstudiante(): boolean {
        return this.rol?.esEstudiante() ?? false;
    }

    /** `true` si el rol del usuario es `'admin'`. Requiere que `rol` esté cargado. */
    esAdministrador(): boolean {
        return this.rol?.esAdministrador() ?? false;
    }

    /** `true` si el usuario puede operar en el sistema (no fue dado de baja). */
    estaActivo(): boolean {
        return this.estado === 'activo';
    }
}
