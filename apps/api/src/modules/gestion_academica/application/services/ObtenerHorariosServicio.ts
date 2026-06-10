import { Injectable, Inject } from '@nestjs/common';
import { IRepositorioHorario } from '../../domain/repositories/IRepositorioHorario';
import { Horario }             from '../../domain/entities/Horario';

@Injectable()
export class ObtenerHorariosServicio {
    constructor(
        @Inject('IRepositorioHorario')
        private readonly horarioRepo: IRepositorioHorario,
    ) { }

    async ejecutar(idComision?: number): Promise<Horario[]> {
        if (idComision) {
            return this.horarioRepo.obtenerPorComision(idComision);
        }
        return this.horarioRepo.obtenerTodos();
    }
}
