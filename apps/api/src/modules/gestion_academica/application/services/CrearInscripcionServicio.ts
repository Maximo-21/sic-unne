import { Injectable, Inject, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { IRepositorioInscripcion } from '../../domain/repositories/IRepositorioInscripcion';
import { IRepositorioComision }    from '../../domain/repositories/IRepositorioComision';
import { Inscripcion }             from '../../domain/entities/Inscripcion';
import { InscripcionMapper }       from '../mappers/InscripcionMapper';
import { CrearInscripcionDto }     from '../dto/crear-inscripcion.dto';
import { InscripcionResponseDto }  from '../dto/inscripcion-response.dto';

@Injectable()
export class CrearInscripcionServicio {
    constructor(
        @Inject('IRepositorioInscripcion')
        private readonly inscripcionRepo: IRepositorioInscripcion,
        @Inject('IRepositorioComision')
        private readonly comisionRepo: IRepositorioComision,
    ) { }

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
