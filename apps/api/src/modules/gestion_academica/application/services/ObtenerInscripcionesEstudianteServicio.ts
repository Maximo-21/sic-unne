import { Injectable, Inject } from '@nestjs/common';
import { IRepositorioInscripcion } from '../../domain/repositories/IRepositorioInscripcion';
import { InscripcionMapper }       from '../mappers/InscripcionMapper';
import { InscripcionResponseDto }  from '../dto/InscripcionResponseDto';

@Injectable()
export class ObtenerInscripcionesEstudianteServicio {
    constructor(
        @Inject('IRepositorioInscripcion')
        private readonly inscripcionRepo: IRepositorioInscripcion,
    ) { }

    async ejecutar(idUsuario: string): Promise<InscripcionResponseDto[]> {
        const inscripciones = await this.inscripcionRepo.obtenerPorUsuario(idUsuario);
        return inscripciones.map(i => InscripcionMapper.toDto(i));
    }
}
