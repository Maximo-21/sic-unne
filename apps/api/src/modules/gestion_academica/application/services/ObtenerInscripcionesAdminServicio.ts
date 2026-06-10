import { Injectable, Inject } from '@nestjs/common';
import { IRepositorioInscripcion } from '../../domain/repositories/IRepositorioInscripcion';
import { InscripcionMapper }       from '../mappers/InscripcionMapper';
import { InscripcionResponseDto }  from '../dto/inscripcion-response.dto';

@Injectable()
export class ObtenerInscripcionesAdminServicio {
    constructor(
        @Inject('IRepositorioInscripcion')
        private readonly inscripcionRepo: IRepositorioInscripcion,
    ) { }

    async ejecutar(): Promise<InscripcionResponseDto[]> {
        const todas = await this.inscripcionRepo.obtenerTodas();
        return todas.map(i => InscripcionMapper.toDto(i));
    }
}
