import { IObservador } from './IObservador';
import { SolicitudIntercambio } from '../entities/SolicitudIntercambio';
import { Propuesta } from '../entities/Propuesta';
import { IRepositorioPropuesta } from '../repositories/IRepositorioPropuesta';
import { IRepositorioSolicitudIntercambio } from '../repositories/IRepositorioSolicitudIntercambio';

/**
 * Observador concreto que reacciona al evento `'en_propuesta'`.
 *
 * Al recibir la notificación:
 * 1. Persiste la nueva Propuesta vinculando ambas solicitudes.
 * 2. Actualiza el estado de ambas solicitudes (sujeto y espejo) a `'en_propuesta'` en la BD.
 *
 * La propuesta creada queda accesible en `propuestaCreada` para que el servicio
 * que orquesta el flujo pueda incluirla en la respuesta HTTP.
 */
export class PropuestaObservador implements IObservador {
    /** Propuesta generada tras el match. Null hasta que se dispara el evento `'en_propuesta'`. */
    public propuestaCreada: Propuesta | null = null;

    /**
     * @param propuestaRepo — repositorio para persistir la nueva Propuesta
     * @param solicitudRepo — repositorio para actualizar el estado de ambas solicitudes
     * @param espejo        — la solicitud simétrica (la "otra parte" del intercambio)
     */
    constructor(
        private readonly propuestaRepo: IRepositorioPropuesta,
        private readonly solicitudRepo: IRepositorioSolicitudIntercambio,
        private readonly espejo: SolicitudIntercambio,
    ) {}

    async actualizar(evento: string, sujeto: SolicitudIntercambio): Promise<void> {
        if (evento !== 'en_propuesta') return;

        this.propuestaCreada = await this.propuestaRepo.guardar(sujeto.id, this.espejo.id);
        await this.solicitudRepo.actualizarEstado(sujeto.id, 'en_propuesta');
        await this.solicitudRepo.actualizarEstado(this.espejo.id, 'en_propuesta');
    }
}
