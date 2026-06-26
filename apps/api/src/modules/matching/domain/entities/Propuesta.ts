import { SolicitudIntercambio } from './SolicitudIntercambio';

/**
 * Representa el emparejamiento entre dos {@link SolicitudIntercambio} simétricas.
 *
 * - `estadoGeneral`: `'pendiente'` | `'aceptada'` | `'rechazada'`
 * - `estadoAlumno1/2`: `'pendiente'` | `'aceptado'` | `'rechazado'`
 *
 * La propuesta se ejecuta (llama al SP `ejecutar_intercambio`) cuando `puedeEjecutarse()` es `true`,
 * lo que ocurre luego de que ambos alumnos aceptan.
 */
export class Propuesta {
    constructor(
        public readonly id:            number,
        public readonly estadoGeneral: string,
        public readonly estadoAlumno1: string,
        public readonly estadoAlumno2: string,
        public readonly fechaMatch:    Date | null,
        public readonly idSolicitud1:  number,
        public readonly idSolicitud2:  number,
        public readonly solicitud1:    SolicitudIntercambio | null,
        public readonly solicitud2:    SolicitudIntercambio | null,
    ) { }

    // ── Estado general ────────────────────────────────────────────────────────

    /** `true` si la propuesta aún aguarda votos de ambos alumnos. */
    estaPendiente(): boolean {
        return this.estadoGeneral === 'pendiente';
    }

    /** `true` si el intercambio fue completado exitosamente. */
    fueAceptada(): boolean {
        return this.estadoGeneral === 'aceptada';
    }

    /** `true` si al menos un alumno rechazó y la propuesta fue descartada. */
    fueRechazada(): boolean {
        return this.estadoGeneral === 'rechazada';
    }

    // ── Votos individuales ────────────────────────────────────────────────────

    /** `true` si el alumno asociado a `solicitud1` ya aceptó. */
    alumno1HaAceptado(): boolean {
        return this.estadoAlumno1 === 'aceptado';
    }

    /** `true` si el alumno asociado a `solicitud2` ya aceptó. */
    alumno2HaAceptado(): boolean {
        return this.estadoAlumno2 === 'aceptado';
    }

    /** `true` si el alumno asociado a `solicitud1` rechazó. */
    alumno1HaRechazado(): boolean {
        return this.estadoAlumno1 === 'rechazado';
    }

    /** `true` si el alumno asociado a `solicitud2` rechazó. */
    alumno2HaRechazado(): boolean {
        return this.estadoAlumno2 === 'rechazado';
    }

    // ── Lógica de decisión ────────────────────────────────────────────────────

    /** `true` si ambos alumnos aceptaron la propuesta. */
    ambosHanAceptado(): boolean {
        return this.alumno1HaAceptado() && this.alumno2HaAceptado();
    }

    /** `true` si al menos uno de los alumnos rechazó. */
    tieneRechazo(): boolean {
        return this.alumno1HaRechazado() || this.alumno2HaRechazado();
    }

    /**
     * `true` si se cumplen todas las precondiciones para ejecutar el intercambio:
     * ambos aceptaron, la propuesta sigue pendiente y las solicitudes están cargadas.
     */
    puedeEjecutarse(): boolean {
        return (
            this.ambosHanAceptado()  &&
            this.estaPendiente()     &&
            this.solicitud1 !== null &&
            this.solicitud2 !== null
        );
    }

    // ── Consultas de datos enriquecidos ───────────────────────────────────────

    /**
     * Nombre de la asignatura involucrada en el intercambio.
     * Usa los datos de `solicitud1` como referencia canónica.
     */
    obtenerNombreAsignatura(): string | null {
        return this.solicitud1?.nombreAsignaturaOrigen ?? null;
    }

    /** Nombre de la comisión de origen del primer alumno. */
    obtenerNombreComisionOrigen(): string | null {
        return this.solicitud1?.nombreComisionOrigen ?? null;
    }

    /** Nombre de la comisión de destino del primer alumno (= comisión de origen del segundo). */
    obtenerNombreComisionDestino(): string | null {
        return this.solicitud1?.nombreComisionDestino ?? null;
    }

    // ── Extracción de datos para el Procedimiento Almacenado ─────────────────

    /**
     * Prepara los parámetros necesarios para llamar al SP `ejecutar_intercambio`.
     * @throws {Error} si las solicitudes no están enriquecidas (lazy-loaded)
     */
    obtenerDatosParaIntercambio(): {
        idUsuario1:         string;
        idComisionOrigen1:  number;
        idComisionDestino1: number;
        idUsuario2:         string;
        idComisionOrigen2:  number;
        idComisionDestino2: number;
    } {
        if (!this.solicitud1 || !this.solicitud2) {
            throw new Error(
                'La propuesta no tiene las solicitudes enriquecidas. No se puede ejecutar el intercambio.'
            );
        }

        return {
            idUsuario1:         this.solicitud1.idUsuario,
            idComisionOrigen1:  this.solicitud1.idComisionOrigen,
            idComisionDestino1: this.solicitud1.idComisionDestino,
            idUsuario2:         this.solicitud2.idUsuario,
            idComisionOrigen2:  this.solicitud2.idComisionOrigen,
            idComisionDestino2: this.solicitud2.idComisionDestino,
        };
    }
}
