import { IObservador } from '../observers/IObservador';

/**
 * Entidad raíz del módulo Matching. Actúa como **Sujeto** del patrón Observer.
 *
 * Ciclo de vida del estado: `pendiente` → `en_propuesta` | `cancelada`.
 * Cuando el estado cambia, todos los observadores registrados son notificados de forma asíncrona.
 *
 * @see {@link PropuestaObservador} — crea la Propuesta al transicionar a `en_propuesta`
 * @see {@link InscripcionObservador} — ejecuta el intercambio al transicionar a `aceptada`
 */
export class SolicitudIntercambio {
    private _estado: string;
    private observadores: IObservador[] = [];

    constructor(
        public readonly id:                     number,
        estado:                                 string,
        public readonly fechaCreacion:          Date | null,
        public readonly idUsuario:              string,
        public readonly idComisionOrigen:       number,
        public readonly idComisionDestino:      number,
        public readonly idAsignaturaOrigen:     number | null,
        public readonly nombreUsuario:          string | null,
        public readonly apellidoUsuario:        string | null,
        public readonly nombreComisionOrigen:   string | null,
        public readonly nombreComisionDestino:  string | null,
        public readonly nombreAsignaturaOrigen: string | null,
    ) {
        this._estado = estado;
    }

    /** Estado actual de la solicitud. Solo mutable vía `cambiarEstado`. */
    get estado(): string {
        return this._estado;
    }

    // ── Observer (Sujeto) ─────────────────────────────────────────────────────

    /** Registra un observador que será notificado en cada cambio de estado. */
    suscribir(observador: IObservador): void {
        this.observadores.push(observador);
    }

    /** Elimina un observador previamente registrado. */
    desuscribir(observador: IObservador): void {
        this.observadores = this.observadores.filter(o => o !== observador);
    }

    /**
     * Muta el estado y notifica a todos los observadores registrados.
     * @param nuevoEstado — valor destino (`'pendiente'`, `'en_propuesta'`, `'cancelada'`)
     */
    async cambiarEstado(nuevoEstado: string): Promise<void> {
        this._estado = nuevoEstado;
        await this.notificar(nuevoEstado);
    }

    private async notificar(evento: string): Promise<void> {
        for (const obs of this.observadores) {
            await obs.actualizar(evento, this);
        }
    }

    // ── Lógica de dominio ────────────────────────────────────────────────────

    /** `true` si la solicitud aún no tiene un match asignado. */
    estaPendiente(): boolean {
        return this._estado === 'pendiente';
    }

    /** `true` si la solicitud ya fue emparejada y tiene una Propuesta activa. */
    estaEnPropuesta(): boolean {
        return this._estado === 'en_propuesta';
    }

    /** `true` si la solicitud fue cancelada (por el alumno manualmente o por rechazo de propuesta). */
    esCancelada(): boolean {
        return this._estado === 'cancelada';
    }

    /** Una solicitud solo puede cancelarse mientras esté en estado `pendiente`. */
    puedeCancelarse(): boolean {
        return this.estaPendiente();
    }

    /** `true` si esta solicitud pertenece al usuario con el id dado. */
    perteneceAUsuario(idUsuario: string): boolean {
        return this.idUsuario === idUsuario;
    }

    /**
     * Determina si `otra` es la solicitud espejo de `this` (precondición del match FIFO).
     * Condiciones: ambas pendientes, distinto alumno, comisiones cruzadas (origen↔destino).
     */
    esEspejo(otra: SolicitudIntercambio): boolean {
        return (
            this.estaPendiente()                               &&
            otra.estaPendiente()                               &&
            this.idUsuario          !== otra.idUsuario         &&
            this.idComisionOrigen   === otra.idComisionDestino &&
            this.idComisionDestino  === otra.idComisionOrigen
        );
    }
}
