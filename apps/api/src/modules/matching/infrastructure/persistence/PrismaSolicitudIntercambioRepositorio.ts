import { Injectable } from '@nestjs/common';
import { PrismaService }                          from '../../../../shared/infrastructure/prisma.service';
import { IRepositorioSolicitudIntercambio }       from '../../domain/repositories/IRepositorioSolicitudIntercambio';
import { SolicitudIntercambio }                   from '../../domain/entities/SolicitudIntercambio';
import { SolicitudIntercambioMapper }             from '../../application/mappers/SolicitudIntercambioMapper';

@Injectable()
export class PrismaSolicitudIntercambioRepositorio implements IRepositorioSolicitudIntercambio {
    constructor(private readonly prisma: PrismaService) { }

    private readonly include = {
        usuario:          true,
        comision_origen:  { include: { asignatura: true } },
        comision_destino: true,
    } as const;

    async buscarPorId(id: number): Promise<SolicitudIntercambio | null> {
        const row = await this.prisma.solicitud_Intercambio.findUnique({
            where:   { id_solicitud: id },
            include: this.include,
        });
        return row ? SolicitudIntercambioMapper.toDomain(row) : null;
    }

    async obtenerPorUsuario(idUsuario: string): Promise<SolicitudIntercambio[]> {
        const rows = await this.prisma.solicitud_Intercambio.findMany({
            where:   { id_usuario: idUsuario },
            include: this.include,
            orderBy: { fecha_creacion: 'desc' },
        });
        return rows.map(row => SolicitudIntercambioMapper.toDomain(row));
    }

    async obtenerPendientesPorUsuario(idUsuario: string): Promise<SolicitudIntercambio[]> {
        const rows = await this.prisma.solicitud_Intercambio.findMany({
            where:   { id_usuario: idUsuario, estado: 'pendiente' },
            include: this.include,
        });
        return rows.map(row => SolicitudIntercambioMapper.toDomain(row));
    }

    async guardar(
        idUsuario: string,
        idComisionOrigen: number,
        idComisionDestino: number,
    ): Promise<SolicitudIntercambio> {
        const row = await this.prisma.solicitud_Intercambio.create({
            data: {
                id_usuario:          idUsuario,
                id_comision_origen:  idComisionOrigen,
                id_comision_destino: idComisionDestino,
            },
            include: this.include,
        });
        return SolicitudIntercambioMapper.toDomain(row);
    }

    async actualizarEstado(id: number, estado: string): Promise<void> {
        await this.prisma.solicitud_Intercambio.update({
            where: { id_solicitud: id },
            data:  { estado },
        });
    }
}
