import { Injectable, Inject } from '@nestjs/common';
import { IRepositorioSolicitudIntercambio } from '../../domain/repositories/IRepositorioSolicitudIntercambio';
import { SolicitudIntercambioMapper }       from '../mappers/SolicitudIntercambioMapper';
import { SolicitudIntercambioResponseDto }  from '../dto/solicitud-intercambio-response.dto';

@Injectable()
export class ObtenerSolicitudesEstudianteServicio {
    constructor(
        @Inject('IRepositorioSolicitudIntercambio')
        private readonly solicitudRepo: IRepositorioSolicitudIntercambio,
    ) {}

    async ejecutar(idUsuario: string): Promise<SolicitudIntercambioResponseDto[]> {
        const solicitudes = await this.solicitudRepo.obtenerPorUsuario(idUsuario);
        return solicitudes.map(s => SolicitudIntercambioMapper.toDto(s));
    }
}
