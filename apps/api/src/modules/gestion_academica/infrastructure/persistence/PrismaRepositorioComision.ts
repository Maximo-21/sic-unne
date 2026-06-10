import { Injectable } from '@nestjs/common';
import { PrismaService }        from '../../../../shared/infrastructure/prisma.service';
import { IRepositorioComision } from '../../domain/repositories/IRepositorioComision';
import { Comision }             from '../../domain/entities/Comision';

@Injectable()
export class PrismaRepositorioComision implements IRepositorioComision {
    constructor(private readonly prisma: PrismaService) { }

    async obtenerTodas(): Promise<Comision[]> {
        const rows = await this.prisma.comision.findMany();
        return rows.map(c => new Comision(c.id_comision, c.nombre_comision, c.id_asignatura));
    }

    async obtenerPorAsignatura(idAsignatura: number): Promise<Comision[]> {
        const rows = await this.prisma.comision.findMany({
            where: { id_asignatura: idAsignatura },
        });
        return rows.map(c => new Comision(c.id_comision, c.nombre_comision, c.id_asignatura));
    }

    async buscarPorId(id: number): Promise<Comision | null> {
        const row = await this.prisma.comision.findUnique({
            where: { id_comision: id },
        });
        return row ? new Comision(row.id_comision, row.nombre_comision, row.id_asignatura) : null;
    }
}
