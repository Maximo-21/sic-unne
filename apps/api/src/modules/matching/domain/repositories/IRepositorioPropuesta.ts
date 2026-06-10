import { Propuesta }             from '../entities/Propuesta';
import { SolicitudIntercambio }  from '../entities/SolicitudIntercambio';

export interface IRepositorioPropuesta {
    buscarPorId(id: number): Promise<Propuesta | null>;
    obtenerPorUsuario(idUsuario: string): Promise<Propuesta[]>;
    obtenerTodas(): Promise<Propuesta[]>;
    guardar(idSolicitud1: number, idSolicitud2: number): Promise<Propuesta>;
    actualizarVoto(idPropuesta: number, numeroAlumno: 1 | 2, voto: string): Promise<Propuesta>;
    actualizarEstadoGeneral(idPropuesta: number, estado: string): Promise<void>;
    buscarEspejos(idComisionOrigen: number, idComisionDestino: number, idUsuarioExcluido: string): Promise<SolicitudIntercambio[]>;
    ejecutarIntercambio(idPropuesta: number): Promise<void>;
}
