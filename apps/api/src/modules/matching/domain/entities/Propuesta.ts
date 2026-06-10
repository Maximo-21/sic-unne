import { SolicitudIntercambio } from './SolicitudIntercambio';

export class Propuesta {
    constructor(
        public readonly id:             number,
        public readonly estadoGeneral:  string,
        public readonly estadoAlumno1:  string,
        public readonly estadoAlumno2:  string,
        public readonly fechaMatch:     Date | null,
        public readonly idSolicitud1:   number,
        public readonly idSolicitud2:   number,
        public readonly solicitud1:     SolicitudIntercambio | null,
        public readonly solicitud2:     SolicitudIntercambio | null,
    ) { }

    // ── Estado general ────────────────────────────────────────────────────────

    estaPendiente(): boolean {
        return this.estadoGeneral === 'pendiente';
    }

    fueAceptada(): boolean {
        return this.estadoGeneral === 'aceptada';
    }

    fueRechazada(): boolean {
        return this.estadoGeneral === 'rechazada';
    }

    // ── Votos individuales ────────────────────────────────────────────────────

    alumno1HaAceptado(): boolean {
        return this.estadoAlumno1 === 'aceptado';
    }

    alumno2HaAceptado(): boolean {
        return this.estadoAlumno2 === 'aceptado';
    }

    alumno1HaRechazado(): boolean {
        return this.estadoAlumno1 === 'rechazado';
    }

    alumno2HaRechazado(): boolean {
        return this.estadoAlumno2 === 'rechazado';
    }

    // ── Lógica de decisión ────────────────────────────────────────────────────

    ambosHanAceptado(): boolean {
        return this.alumno1HaAceptado() && this.alumno2HaAceptado();
    }

    tieneRechazo(): boolean {
        return this.alumno1HaRechazado() || this.alumno2HaRechazado();
    }

    puedeEjecutarse(): boolean {
        return (
            this.ambosHanAceptado() &&
            this.estaPendiente()    &&
            this.solicitud1 !== null &&
            this.solicitud2 !== null
        );
    }

    // ── Extracción de datos para el Procedimiento Almacenado ─────────────────

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
