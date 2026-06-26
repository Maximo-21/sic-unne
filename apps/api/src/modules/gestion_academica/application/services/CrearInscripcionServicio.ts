import { Injectable, Inject, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { IRepositorioInscripcion } from '../../domain/repositories/IRepositorioInscripcion';
import { IRepositorioComision }    from '../../domain/repositories/IRepositorioComision';
import { Inscripcion }             from '../../domain/entities/Inscripcion';
import { InscripcionMapper }       from '../mappers/InscripcionMapper';
import { CrearInscripcionDto }     from '../dto/CrearInscripcionDto';
import { InscripcionResponseDto }  from '../dto/InscripcionResponseDto';

/**
 * Caso de uso: **Inscribirse en una Comisión** (HU2 — Consultar Datos Académicos → seleccionar comisión).
 *
 * Pre-condiciones:
 * - La comisión debe existir.
 * - El alumno no debe estar ya inscripto en la misma comisión.
 * - El alumno no debe tener inscripción activa en la misma asignatura (una asignatura = una comisión).
 *
 * @throws {NotFoundException}   si la comisión no existe
 * @throws {ConflictException}   si el alumno ya está inscripto en esa comisión
 * @throws {BadRequestException} si ya tiene inscripción activa en la misma asignatura
 */
@Injectable()
export class CrearInscripcionServicio {
    constructor(
        @Inject('IRepositorioInscripcion')
        private readonly inscripcionRepo: IRepositorioInscripcion,
        @Inject('IRepositorioComision')
        private readonly comisionRepo: IRepositorioComision,
    ) { }

    /**
     * Crea una inscripción activa para el alumno en la comisión indicada.
     * @param idUsuario — UUID del alumno que se inscribe
     * @param dto       — id de la comisión destino
     * @returns DTO con los datos de la inscripción creada
     */
    async ejecutar(idUsuario: string, dto: CrearInscripcionDto): Promise<InscripcionResponseDto> {
        const comision = await this.comisionRepo.buscarPorId(dto.idComision);
        if (!comision) {
            throw new NotFoundException(`Comisión ${dto.idComision} no encontrada.`);
        }

        const existente = await this.inscripcionRepo.buscarPorUsuarioYComision(idUsuario, dto.idComision);
        if (existente) {
            throw new ConflictException(`Ya estás inscripto en la comisión ${dto.idComision}.`);
        }

        const inscripcionAsignatura = await this.inscripcionRepo.buscarPorUsuarioYAsignatura(
            idUsuario,
            comision.id_asignatura,
        );
        if (inscripcionAsignatura) {
            throw new BadRequestException(
                'Ya tenés una inscripción activa en esa asignatura. ' +
                'Cancelala primero si querés cambiarte a otra comisión.',
            );
        }

        const nueva = new Inscripcion(0, 'activa', new Date(), dto.idComision, idUsuario, null, null);
        const guardada = await this.inscripcionRepo.guardar(nueva);
        return InscripcionMapper.toDto(guardada);
    }
}
