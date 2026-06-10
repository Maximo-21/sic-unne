import {
    Injectable, Inject,
    NotFoundException, ForbiddenException, BadRequestException,
} from '@nestjs/common';
import { IRepositorioSolicitudIntercambio } from '../../domain/repositories/IRepositorioSolicitudIntercambio';

@Injectable()
export class CancelarSolicitudServicio {
    constructor(
        @Inject('IRepositorioSolicitudIntercambio')
        private readonly solicitudRepo: IRepositorioSolicitudIntercambio,
    ) {}

    async ejecutar(idSolicitud: number, idUsuario: string): Promise<void> {
        const solicitud = await this.solicitudRepo.buscarPorId(idSolicitud);
        if (!solicitud) throw new NotFoundException(`Solicitud ${idSolicitud} no encontrada.`);
        if (!solicitud.perteneceAUsuario(idUsuario)) throw new ForbiddenException('No tenés permisos para cancelar esta solicitud.');
        if (!solicitud.puedeCancelarse()) throw new BadRequestException('La solicitud no puede cancelarse en su estado actual.');
        await this.solicitudRepo.actualizarEstado(idSolicitud, 'cancelada');
    }
}
