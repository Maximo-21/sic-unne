import { SolicitudIntercambio } from '../entities/SolicitudIntercambio';

/**
 * Contrato del patrón Observer para el módulo Matching.
 *
 * Implementaciones concretas:
 * - {@link PropuestaObservador} — reacciona al evento `'en_propuesta'` creando la Propuesta
 * - {@link InscripcionObservador} — reacciona al evento `'aceptada'` ejecutando el intercambio
 */
export interface IObservador {
    /**
     * Callback invocado por {@link SolicitudIntercambio} cuando su estado cambia.
     * @param evento — nuevo estado de la solicitud (`'en_propuesta'`, `'aceptada'`, etc.)
     * @param sujeto — referencia a la solicitud que originó el evento
     */
    actualizar(evento: string, sujeto: SolicitudIntercambio): Promise<void>;
}
