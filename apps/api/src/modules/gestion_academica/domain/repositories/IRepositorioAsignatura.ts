import { Asignatura } from '../entities/Asignatura';

export interface IRepositorioAsignatura {
    obtenerTodas(): Promise<Asignatura[]>;
    buscarPorId(id: number): Promise<Asignatura | null>;
}
