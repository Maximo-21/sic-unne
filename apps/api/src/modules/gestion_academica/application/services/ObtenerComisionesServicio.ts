import { Injectable, Inject } from '@nestjs/common';
import { IRepositorioComision } from '../../domain/repositories/IRepositorioComision';
import { Comision }             from '../../domain/entities/Comision';

@Injectable()
export class ObtenerComisionesServicio {
    constructor(
        @Inject('IRepositorioComision')
        private readonly comisionRepo: IRepositorioComision,
    ) { }

    async ejecutar(idAsignatura?: number): Promise<Comision[]> {
        if (idAsignatura) {
            return this.comisionRepo.obtenerPorAsignatura(idAsignatura);
        }
        return this.comisionRepo.obtenerTodas();
    }
}
