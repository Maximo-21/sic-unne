import { Injectable } from '@nestjs/common';
import { PrismaService }           from '../../../../shared/infrastructure/prisma.service';
import { IRepositorioInscripcion } from '../../domain/repositories/IRepositorioInscripcion';
import { Inscripcion }             from '../../domain/entities/Inscripcion';
import { InscripcionMapper }       from '../../application/mappers/InscripcionMapper';

@Injectable()
export class PrismaRepositorioInscripcion implements IRepositorioInscripcion {
    constructor(private readonly prisma: PrismaService) { }

    async guardar(inscripcion: Inscripcion): Promise<Inscripcion> {
        const creada = await this.prisma.inscripcion.create({
            data: {
                estado:      inscripcion.estado,
                id_comision: inscripcion.idComision,
                id_usuario:  inscripcion.idUsuario,
            },
            include: { comision: { include: { asignatura: true } } },
        });
        return InscripcionMapper.toDomain(creada);
    }

    async buscarPorId(id: number): Promise<Inscripcion | null> {
        const row = await this.prisma.inscripcion.findUnique({
            where: { id_inscripcion: id },
            include: { comision: { include: { asignatura: true } } },
        });
        return row ? InscripcionMapper.toDomain(row) : null;
    }

    async buscarPorUsuarioYComision(idUsuario: string, idComision: number): Promise<Inscripcion | null> {
        const row = await this.prisma.inscripcion.findFirst({
            where: { id_usuario: idUsuario, id_comision: idComision, estado: 'activa' },
            include: { comision: { include: { asignatura: true } } },
        });
        return row ? InscripcionMapper.toDomain(row) : null;
    }

    async buscarPorUsuarioYAsignatura(idUsuario: string, idAsignatura: number): Promise<Inscripcion | null> {
        const row = await this.prisma.inscripcion.findFirst({
            where: {
                id_usuario: idUsuario,
                estado:     'activa',
                comision:   { id_asignatura: idAsignatura },
            },
            include: { comision: { include: { asignatura: true } } },
        });
        return row ? InscripcionMapper.toDomain(row) : null;
    }

    async obtenerPorUsuario(idUsuario: string): Promise<Inscripcion[]> {
        const rows = await this.prisma.inscripcion.findMany({
            where: { id_usuario: idUsuario },
            include: { comision: { include: { asignatura: true } } },
        });
        return rows.map(r => InscripcionMapper.toDomain(r));
    }

    async obtenerTodas(): Promise<Inscripcion[]> {
        const rows = await this.prisma.inscripcion.findMany({
            include: { comision: { include: { asignatura: true } } },
        });
        return rows.map(r => InscripcionMapper.toDomain(r));
    }
}
