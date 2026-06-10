import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { IRepositorioSolicitudIntercambio }  from '../../domain/repositories/IRepositorioSolicitudIntercambio';
import { IRepositorioPropuesta }             from '../../domain/repositories/IRepositorioPropuesta';
import { IRepositorioInscripcion }           from '../../../gestion_academica/domain/repositories/IRepositorioInscripcion';
import { SolicitudIntercambioMapper }        from '../mappers/SolicitudIntercambioMapper';
import { PropuestaMapper }                   from '../mappers/PropuestaMapper';
import { CrearSolicitudDto }              from '../dto/crear-solicitud.dto';
import { ResultadoCrearSolicitudDto }     from '../dto/resultado-crear-solicitud.dto';

@Injectable()
export class CrearSolicitudServicio {
    constructor(
        @Inject('IRepositorioSolicitudIntercambio')
        private readonly solicitudRepo: IRepositorioSolicitudIntercambio,
        @Inject('IRepositorioPropuesta')
        private readonly propuestaRepo: IRepositorioPropuesta,
        @Inject('IRepositorioInscripcion')
        private readonly inscripcionRepo: IRepositorioInscripcion,
    ) {}

    async ejecutar(idUsuario: string, dto: CrearSolicitudDto): Promise<ResultadoCrearSolicitudDto> {
        if (dto.idComisionOrigen === dto.idComisionDestino) {
            throw new BadRequestException('Las comisiones de origen y destino no pueden ser la misma.');
        }

        const inscripcion = await this.inscripcionRepo.buscarPorUsuarioYComision(
            idUsuario,
            dto.idComisionOrigen,
        );
        if (!inscripcion || !inscripcion.puedeParticiparEnIntercambio()) {
            throw new BadRequestException('No tenés inscripción activa en esa comisión.');
        }

        const solicitud = await this.solicitudRepo.guardar(
            idUsuario,
            dto.idComisionOrigen,
            dto.idComisionDestino,
        );

        const espejos = await this.propuestaRepo.buscarEspejos(
            solicitud.idComisionOrigen,
            solicitud.idComisionDestino,
            idUsuario,
        );

        if (espejos.length === 0) {
            return {
                solicitud: SolicitudIntercambioMapper.toDto(solicitud),
                propuesta: null,
            };
        }

        const espejo    = espejos[0];
        const propuesta = await this.propuestaRepo.guardar(solicitud.id, espejo.id);

        await this.solicitudRepo.actualizarEstado(solicitud.id, 'en_propuesta');
        await this.solicitudRepo.actualizarEstado(espejo.id,    'en_propuesta');

        return {
            solicitud: SolicitudIntercambioMapper.toDto(solicitud),
            propuesta: PropuestaMapper.toDto(propuesta),
        };
    }
}
