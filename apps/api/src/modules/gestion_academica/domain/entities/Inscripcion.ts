/**
 * Entidad que representa la inscripción de un alumno en una comisión de cursado.
 *
 * Solo las inscripciones con estado `'activa'` pueden participar en solicitudes de intercambio.
 * El método `actualizarComision` refleja el resultado de un intercambio exitoso.
 */
export class Inscripcion {
    constructor(
        public readonly id:               number,
        public readonly estado:           string,
        public readonly fechaInscripcion: Date | null,
        public readonly idComision:       number,
        public readonly idUsuario:        string,
        public readonly nombreComision:   string | null,
        public readonly nombreAsignatura: string | null,
    ) { }

    /** `true` si la inscripción está vigente. */
    estaActiva(): boolean {
        return this.estado === 'activa';
    }

    /** Una inscripción puede participar en un intercambio solo si está activa. */
    puedeParticiparEnIntercambio(): boolean {
        return this.estaActiva();
    }

    /** `true` si esta inscripción pertenece al usuario con el id dado. */
    perteneceAUsuario(idUsuario: string): boolean {
        return this.idUsuario === idUsuario;
    }

    /**
     * Crea una nueva instancia de Inscripcion con la comisión actualizada al valor destino.
     * Retorna una nueva entidad (inmutabilidad) en lugar de mutar `idComision`.
     * @param nuevaIdComision — id de la comisión de destino post-intercambio
     */
    actualizarComision(nuevaIdComision: number): Inscripcion {
        return new Inscripcion(
            this.id,
            this.estado,
            this.fechaInscripcion,
            nuevaIdComision,
            this.idUsuario,
            null,
            null,
        );
    }
}
