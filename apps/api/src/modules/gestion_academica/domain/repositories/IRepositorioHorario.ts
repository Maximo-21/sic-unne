import { Horario } from '../entities/Horario';

export interface IRepositorioHorario {
    obtenerTodos(): Promise<Horario[]>;
    obtenerPorComision(idComision: number): Promise<Horario[]>;
    buscarPorId(id: number): Promise<Horario | null>;
}
