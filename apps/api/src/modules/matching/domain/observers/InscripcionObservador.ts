import { IObservador } from './IObservador';
import { SolicitudIntercambio } from '../entities/SolicitudIntercambio';
import { IRepositorioPropuesta } from '../repositories/IRepositorioPropuesta';

/**
 * Observador concreto que reacciona al evento `'aceptada'`.
 *
 * Al recibir la notificación (ambos alumnos aceptaron):
 * 1. Llama al stored procedure `ejecutar_intercambio` vía Prisma para intercambiar las inscripciones.
 * 2. Marca el `estadoGeneral` de la Propuesta como `'aceptada'`.
 */
export class InscripcionObservador implements IObservador {
    /**
     * @param propuestaRepo — repositorio que expone `ejecutarIntercambio` y `actualizarEstadoGeneral`
     * @param idPropuesta   — id de la propuesta que disparó el intercambio
     */
    constructor(
        private readonly propuestaRepo: IRepositorioPropuesta,
        private readonly idPropuesta: number,
    ) {}

    async actualizar(evento: string, _sujeto: SolicitudIntercambio): Promise<void> {
        if (evento !== 'aceptada') return;

        await this.propuestaRepo.ejecutarIntercambio(this.idPropuesta);
        await this.propuestaRepo.actualizarEstadoGeneral(this.idPropuesta, 'aceptada');
    }
}
