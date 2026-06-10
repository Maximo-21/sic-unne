import { clienteAPI } from '@shared/services/ClienteAPI';
import { Solicitud } from '../types/Solicitud';
import { Propuesta } from '../types/Propuesta';

interface ResultadoCrearSolicitud {
  solicitud: Solicitud;
  propuesta: Propuesta | null;
}

export const MatchingServicio = {
  async crearSolicitud(idComisionOrigen: number, idComisionDestino: number): Promise<ResultadoCrearSolicitud> {
    const r = await clienteAPI.post<{ data: ResultadoCrearSolicitud }>('/matching/solicitudes', {
      idComisionOrigen,
      idComisionDestino,
    });
    return r.data;
  },

  async obtenerMisSolicitudes(): Promise<Solicitud[]> {
    const r = await clienteAPI.obtener<{ data: Solicitud[] }>('/matching/solicitudes/me');
    return r.data;
  },

  async cancelarSolicitud(id: number): Promise<void> {
    await clienteAPI.eliminar(`/matching/solicitudes/${id}`);
  },

  async obtenerMisPropuestas(): Promise<Propuesta[]> {
    const r = await clienteAPI.obtener<{ data: Propuesta[] }>('/matching/propuestas/me');
    return r.data;
  },

  async obtenerTodasPropuestas(): Promise<Propuesta[]> {
    const r = await clienteAPI.obtener<{ data: Propuesta[] }>('/matching/propuestas');
    return r.data;
  },

  async votarPropuesta(id: number, voto: 'aceptado' | 'rechazado'): Promise<Propuesta> {
    const r = await clienteAPI.patch<{ data: Propuesta }>(`/matching/propuestas/${id}/votar`, { voto });
    return r.data;
  },
};
