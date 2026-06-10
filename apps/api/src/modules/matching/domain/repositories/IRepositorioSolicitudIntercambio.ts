import { SolicitudIntercambio } from '../entities/SolicitudIntercambio';

export interface IRepositorioSolicitudIntercambio {
    buscarPorId(id: number): Promise<SolicitudIntercambio | null>;
    obtenerPorUsuario(idUsuario: string): Promise<SolicitudIntercambio[]>;
    obtenerPendientesPorUsuario(idUsuario: string): Promise<SolicitudIntercambio[]>;
    guardar(idUsuario: string, idComisionOrigen: number, idComisionDestino: number): Promise<SolicitudIntercambio>;
    actualizarEstado(id: number, estado: string): Promise<void>;
}
