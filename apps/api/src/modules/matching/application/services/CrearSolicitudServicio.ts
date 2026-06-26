import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { IRepositorioSolicitudIntercambio } from '../../domain/repositories/IRepositorioSolicitudIntercambio';
import { IRepositorioPropuesta } from '../../domain/repositories/IRepositorioPropuesta';
import { IRepositorioInscripcion } from '../../../gestion_academica/domain/repositories/IRepositorioInscripcion';
import { PropuestaObservador } from '../../domain/observers/PropuestaObservador';
import { SolicitudIntercambioMapper } from '../mappers/SolicitudIntercambioMapper';
import { PropuestaMapper } from '../mappers/PropuestaMapper';
import { CrearSolicitudDto } from '../dto/CrearSolicitudDto';
import { ResultadoCrearSolicitudDto } from '../dto/ResultadoCrearSolicitudDto';

/**
 * Caso de uso: **Solicitar Intercambio** (contrato `SolicitarIntercambio` del documento SIC-UNNE).
 *
 * Flujo completo:
 * 1. Valida que origen ≠ destino.
 * 2. Verifica que el alumno tenga inscripción activa en la comisión de origen (HU3).
 * 3. Persiste la solicitud con estado `'pendiente'`.
 * 4. Busca solicitudes espejo via SP `buscar_espejos_disponibles` (algoritmo FIFO — HU4).
 * 5. Si hay espejo: suscribe `PropuestaObservador`, dispara `cambiarEstado('en_propuesta')`
 *    → el observador crea la Propuesta y actualiza ambas solicitudes en la BD.
 * 6. Retorna la solicitud creada y, si aplica, la propuesta generada.
 *
 * @throws {BadRequestException} si origen === destino o no hay inscripción activa en origen
 */
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

    /**
     * @param idUsuario — UUID del alumno que inicia el intercambio
     * @param dto       — comisiones de origen y destino
     * @returns objeto con la solicitud creada y la propuesta generada (o `null` si no hubo match)
     */
    async ejecutar(
        idUsuario: string,
        dto: CrearSolicitudDto,
    ): Promise<ResultadoCrearSolicitudDto> {
        if (dto.idComisionOrigen === dto.idComisionDestino) {
            throw new BadRequestException(
                'Las comisiones de origen y destino no pueden ser la misma.',
            );
        }

        const inscripcion = await this.inscripcionRepo.buscarPorUsuarioYComision(
            idUsuario,
            dto.idComisionOrigen,
        );
        if (!inscripcion || !inscripcion.puedeParticiparEnIntercambio()) {
            throw new BadRequestException(
                'No tenés inscripción activa en esa comisión.',
            );
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

        const espejo = espejos[0];
        const observador = new PropuestaObservador(this.propuestaRepo, this.solicitudRepo, espejo);
        solicitud.suscribir(observador);
        await solicitud.cambiarEstado('en_propuesta');

        return {
            solicitud: SolicitudIntercambioMapper.toDto(solicitud),
            propuesta: observador.propuestaCreada
                ? PropuestaMapper.toDto(observador.propuestaCreada)
                : null,
        };
    }
}
