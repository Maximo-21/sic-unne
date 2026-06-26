import {
    Injectable, Inject,
    NotFoundException, ForbiddenException, BadRequestException,
} from '@nestjs/common';
import { IRepositorioSolicitudIntercambio } from '../../domain/repositories/IRepositorioSolicitudIntercambio';
import { IRepositorioPropuesta }            from '../../domain/repositories/IRepositorioPropuesta';
import { InscripcionObservador }            from '../../domain/observers/InscripcionObservador';
import { PropuestaMapper }                  from '../mappers/PropuestaMapper';
import { VotarPropuestaDto }                from '../dto/VotarPropuestaDto';
import { PropuestaResponseDto }             from '../dto/PropuestaResponseDto';

/**
 * Caso de uso: **Votar Propuesta** (HU5 — Aceptar/Rechazar intercambio).
 *
 * Flujo de decisión (HU5):
 * - Si hay rechazo → la propuesta pasa a `'rechazada'`. La solicitud del alumno que rechazó
 *   pasa a `'cancelada'`; la del otro alumno vuelve a `'pendiente'` (preservando fecha_creacion).
 * - Si ambos aceptan → suscribe `InscripcionObservador` a `solicitud1`, dispara
 *   `cambiarEstado('aceptada')` → el observador llama al SP `ejecutar_intercambio`
 *   y marca la propuesta como `'aceptada'`.
 * - Si falta un voto → retorna el estado intermedio sin acciones adicionales.
 *
 * @throws {NotFoundException}   si la propuesta no existe
 * @throws {BadRequestException} si la propuesta ya fue resuelta o el alumno ya votó
 * @throws {ForbiddenException}  si el usuario no pertenece a ninguna de las solicitudes
 */
@Injectable()
export class VotarPropuestaServicio {
    constructor(
        @Inject('IRepositorioPropuesta')
        private readonly propuestaRepo: IRepositorioPropuesta,
        @Inject('IRepositorioSolicitudIntercambio')
        private readonly solicitudRepo: IRepositorioSolicitudIntercambio,
    ) {}

    /**
     * Registra el voto del alumno y aplica las consecuencias del estado resultante.
     * @param idPropuesta — id de la propuesta a votar
     * @param idUsuario   — UUID del alumno que vota
     * @param dto         — voto (`'aceptado'` o `'rechazado'`)
     * @returns DTO con el estado final de la propuesta tras procesar el voto
     */
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

            // HU5: la solicitud del alumno que rechazó → 'cancelada'; la del otro → 'pendiente'
            const rechazoAlumno1 = actualizada.alumno1HaRechazado();
            const idSolicitudCancelada = rechazoAlumno1 ? actualizada.idSolicitud1 : actualizada.idSolicitud2;
            const idSolicitudRestante  = rechazoAlumno1 ? actualizada.idSolicitud2 : actualizada.idSolicitud1;

            await this.solicitudRepo.actualizarEstado(idSolicitudCancelada, 'cancelada');
            await this.solicitudRepo.actualizarEstado(idSolicitudRestante,  'pendiente');

            const final = await this.propuestaRepo.buscarPorId(idPropuesta);
            return PropuestaMapper.toDto(final!);
        }

        if (actualizada.puedeEjecutarse()) {
            const observador = new InscripcionObservador(this.propuestaRepo, idPropuesta);
            actualizada.solicitud1!.suscribir(observador);
            await actualizada.solicitud1!.cambiarEstado('aceptada');
            const final = await this.propuestaRepo.buscarPorId(idPropuesta);
            return PropuestaMapper.toDto(final!);
        }

        return PropuestaMapper.toDto(actualizada);
    }
}
