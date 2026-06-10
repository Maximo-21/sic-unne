import { Comision } from '../entities/Comision';

export interface IRepositorioComision {
    obtenerTodas(): Promise<Comision[]>;
    obtenerPorAsignatura(idAsignatura: number): Promise<Comision[]>;
    buscarPorId(id: number): Promise<Comision | null>;
}
