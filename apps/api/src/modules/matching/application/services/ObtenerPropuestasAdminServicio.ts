import { Injectable, Inject } from '@nestjs/common';
import { IRepositorioPropuesta } from '../../domain/repositories/IRepositorioPropuesta';
import { PropuestaMapper }       from '../mappers/PropuestaMapper';
import { PropuestaResponseDto }  from '../dto/PropuestaResponseDto';

@Injectable()
export class ObtenerPropuestasAdminServicio {
    constructor(
        @Inject('IRepositorioPropuesta')
        private readonly propuestaRepo: IRepositorioPropuesta,
    ) {}

    async ejecutar(): Promise<PropuestaResponseDto[]> {
        const propuestas = await this.propuestaRepo.obtenerTodas();
        return propuestas.map(p => PropuestaMapper.toDto(p));
    }
}
