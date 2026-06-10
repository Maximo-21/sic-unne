import { Inscripcion } from '../entities/Inscripcion';

export interface IRepositorioInscripcion {
    guardar(inscripcion: Inscripcion): Promise<Inscripcion>;
    buscarPorId(id: number): Promise<Inscripcion | null>;
    buscarPorUsuarioYComision(idUsuario: string, idComision: number): Promise<Inscripcion | null>;
    buscarPorUsuarioYAsignatura(idUsuario: string, idAsignatura: number): Promise<Inscripcion | null>;
    obtenerPorUsuario(idUsuario: string): Promise<Inscripcion[]>;
    obtenerTodas(): Promise<Inscripcion[]>;
}
