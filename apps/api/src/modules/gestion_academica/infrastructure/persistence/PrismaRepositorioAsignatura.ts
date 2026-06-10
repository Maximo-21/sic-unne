import { Injectable } from '@nestjs/common';
import { PrismaService }          from '../../../../shared/infrastructure/prisma.service';
import { IRepositorioAsignatura } from '../../domain/repositories/IRepositorioAsignatura';
import { Asignatura }             from '../../domain/entities/Asignatura';

@Injectable()
export class PrismaRepositorioAsignatura implements IRepositorioAsignatura {
    constructor(private readonly prisma: PrismaService) { }

    async obtenerTodas(): Promise<Asignatura[]> {
        const rows = await this.prisma.asignatura.findMany();
        return rows.map(a => new Asignatura(a.id_asignatura, a.nombre_asignatura, a.anio_asignatura));
    }

    async buscarPorId(id: number): Promise<Asignatura | null> {
        const row = await this.prisma.asignatura.findUnique({
            where: { id_asignatura: id },
        });
        return row ? new Asignatura(row.id_asignatura, row.nombre_asignatura, row.anio_asignatura) : null;
    }
}
