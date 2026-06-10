import { Injectable } from '@nestjs/common';
import { PrismaService }       from '../../../../shared/infrastructure/prisma.service';
import { IRepositorioHorario } from '../../domain/repositories/IRepositorioHorario';
import { Horario }             from '../../domain/entities/Horario';

@Injectable()
export class PrismaRepositorioHorario implements IRepositorioHorario {
    constructor(private readonly prisma: PrismaService) { }

    async obtenerTodos(): Promise<Horario[]> {
        const rows = await this.prisma.horario.findMany();
        return rows.map(h => new Horario(h.id_horario, h.dia, h.hora_desde, h.hora_hasta, h.modalidad, h.id_comision));
    }

    async obtenerPorComision(idComision: number): Promise<Horario[]> {
        const rows = await this.prisma.horario.findMany({
            where: { id_comision: idComision },
        });
        return rows.map(h => new Horario(h.id_horario, h.dia, h.hora_desde, h.hora_hasta, h.modalidad, h.id_comision));
    }

    async buscarPorId(id: number): Promise<Horario | null> {
        const row = await this.prisma.horario.findUnique({
            where: { id_horario: id },
        });
        return row ? new Horario(row.id_horario, row.dia, row.hora_desde, row.hora_hasta, row.modalidad, row.id_comision) : null;
    }
}
