import { clienteAPI } from '@shared/services/ClienteAPI';
import { Solicitud } from '../types/Solicitud';
import { Propuesta } from '../types/Propuesta';

interface ResultadoCrearSolicitud {
  solicitud: Solicitud;
  propuesta: Propuesta | null;
}

/**
 * Servicio frontend para el módulo de Matching.
 * Encapsula todas las llamadas a `/matching` en la API backend.
 *
 * Implementa HU3 (crear solicitud), HU4 (match automático) y HU5 (votar propuesta).
 */
export const MatchingServicio = {
  /**
   * Crea una solicitud de intercambio (HU3).
   * Si existe una solicitud espejo, el backend genera la Propuesta automáticamente (HU4).
   * @param idComisionOrigen  — comisión en la que el alumno está inscripto actualmente
   * @param idComisionDestino — comisión a la que desea cambiarse
   * @returns objeto con la solicitud creada y la propuesta (o `null` si no hubo match inmediato)
   */
  async crearSolicitud(idComisionOrigen: number, idComisionDestino: number): Promise<ResultadoCrearSolicitud> {
    const r = await clienteAPI.post<{ data: ResultadoCrearSolicitud }>('/matching/solicitudes', {
      idComisionOrigen,
      idComisionDestino,
    });
    return r.data;
  },

  /** Retorna todas las solicitudes de intercambio del alumno autenticado. */
  async obtenerMisSolicitudes(): Promise<Solicitud[]> {
    const r = await clienteAPI.obtener<{ data: Solicitud[] }>('/matching/solicitudes/me');
    return r.data;
  },

  /**
   * Cancela una solicitud pendiente del alumno autenticado.
   * @param id — id de la solicitud a cancelar
   */
  async cancelarSolicitud(id: number): Promise<void> {
    await clienteAPI.eliminar(`/matching/solicitudes/${id}`);
  },

  /** Retorna las propuestas activas en las que participa el alumno autenticado (HU5). */
  async obtenerMisPropuestas(): Promise<Propuesta[]> {
    const r = await clienteAPI.obtener<{ data: Propuesta[] }>('/matching/propuestas/me');
    return r.data;
  },

  /** Retorna todas las propuestas del sistema (requiere rol admin). */
  async obtenerTodasPropuestas(): Promise<Propuesta[]> {
    const r = await clienteAPI.obtener<{ data: Propuesta[] }>('/matching/propuestas');
    return r.data;
  },

  /**
   * Registra el voto del alumno autenticado en una propuesta (HU5).
   * @param id   — id de la propuesta
   * @param voto — decisión del alumno (`'aceptado'` | `'rechazado'`)
   */
  async votarPropuesta(id: number, voto: 'aceptado' | 'rechazado'): Promise<Propuesta> {
    const r = await clienteAPI.patch<{ data: Propuesta }>(`/matching/propuestas/${id}/votar`, { voto });
    return r.data;
  },
};
