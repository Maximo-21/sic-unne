import {
    Injectable, Inject,
    NotFoundException, ForbiddenException, BadRequestException,
} from '@nestjs/common';
import { IRepositorioSolicitudIntercambio } from '../../domain/repositories/IRepositorioSolicitudIntercambio';
import { IRepositorioPropuesta }            from '../../domain/repositories/IRepositorioPropuesta';
import { PropuestaMapper }                  from '../mappers/PropuestaMapper';
import { VotarPropuestaDto }                from '../dto/votar-propuesta.dto';
import { PropuestaResponseDto }             from '../dto/propuesta-response.dto';

@Injectable()
export class VotarPropuestaServicio {
    constructor(
        @Inject('IRepositorioPropuesta')
        private readonly propuestaRepo: IRepositorioPropuesta,
        @Inject('IRepositorioSolicitudIntercambio')
        private readonly solicitudRepo: IRepositorioSolicitudIntercambio,
    ) {}

    async ejecutar(
        idPropuesta: number,
        idUsuario: string,
        dto: VotarPropuestaDto,
    ): Promise<PropuestaResponseDto> {
        const propuesta = await this.propuestaRepo.buscarPorId(idPropuesta);
        if (!propuesta) {
            throw new NotFoundException(`Propuesta ${idPropuesta} no encontrada.`);
        }
        if (!propuesta.estaPendiente()) {
            throw new BadRequestException('La propuesta ya fue resuelta y no admite más votos.');
        }
        if (!propuesta.solicitud1 || !propuesta.solicitud2) {
            throw new BadRequestException('La propuesta no tiene las solicitudes enriquecidas.');
        }

        let numeroAlumno: 1 | 2;
        if (propuesta.solicitud1.idUsuario === idUsuario) {
            if (propuesta.alumno1HaAceptado() || propuesta.alumno1HaRechazado()) {
                throw new BadRequestException('Ya registraste tu voto en esta propuesta.');
            }
            numeroAlumno = 1;
        } else if (propuesta.solicitud2.idUsuario === idUsuario) {
            if (propuesta.alumno2HaAceptado() || propuesta.alumno2HaRechazado()) {
                throw new BadRequestException('Ya registraste tu voto en esta propuesta.');
            }
            numeroAlumno = 2;
        } else {
            throw new ForbiddenException('No pertenecés a esta propuesta.');
        }

        const actualizada = await this.propuestaRepo.actualizarVoto(idPropuesta, numeroAlumno, dto.voto);

        if (actualizada.tieneRechazo()) {
            await this.propuestaRepo.actualizarEstadoGeneral(idPropuesta, 'rechazada');
            await this.solicitudRepo.actualizarEstado(actualizada.idSolicitud1, 'pendiente');
            await this.solicitudRepo.actualizarEstado(actualizada.idSolicitud2, 'pendiente');
            const final = await this.propuestaRepo.buscarPorId(idPropuesta);
            return PropuestaMapper.toDto(final!);
        }

        if (actualizada.ambosHanAceptado()) {
            await this.propuestaRepo.ejecutarIntercambio(idPropuesta);
            await this.propuestaRepo.actualizarEstadoGeneral(idPropuesta, 'aceptada');
            const final = await this.propuestaRepo.buscarPorId(idPropuesta);
            return PropuestaMapper.toDto(final!);
        }

        return PropuestaMapper.toDto(actualizada);
    }
}
