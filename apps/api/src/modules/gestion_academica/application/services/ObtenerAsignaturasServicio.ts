import { Injectable, Inject } from '@nestjs/common';
import { IRepositorioAsignatura } from '../../domain/repositories/IRepositorioAsignatura';
import { Asignatura }             from '../../domain/entities/Asignatura';

@Injectable()
export class ObtenerAsignaturasServicio {
    constructor(
        @Inject('IRepositorioAsignatura')
        private readonly asignaturaRepo: IRepositorioAsignatura,
    ) { }

    async ejecutar(): Promise<Asignatura[]> {
        return this.asignaturaRepo.obtenerTodas();
    }
}
