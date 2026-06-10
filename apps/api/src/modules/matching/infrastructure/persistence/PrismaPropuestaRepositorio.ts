import { Injectable } from '@nestjs/common';
import { PrismaService }              from '../../../../shared/infrastructure/prisma.service';
import { IRepositorioPropuesta }      from '../../domain/repositories/IRepositorioPropuesta';
import { Propuesta }                  from '../../domain/entities/Propuesta';
import { SolicitudIntercambio }       from '../../domain/entities/SolicitudIntercambio';
import { PropuestaMapper }            from '../../application/mappers/PropuestaMapper';
import { SolicitudIntercambioMapper } from '../../application/mappers/SolicitudIntercambioMapper';

const INCLUDE_SOLICITUD = {
    usuario:          true,
    comision_origen:  { include: { asignatura: true } },
    comision_destino: true,
} as const;

const INCLUDE_PROPUESTA = {
    solicitud_1: { include: INCLUDE_SOLICITUD },
    solicitud_2: { include: INCLUDE_SOLICITUD },
} as const;

@Injectable()
export class PrismaPropuestaRepositorio implements IRepositorioPropuesta {
    constructor(private readonly prisma: PrismaService) { }

    async buscarPorId(id: number): Promise<Propuesta | null> {
        const row = await this.prisma.propuesta.findUnique({
            where:   { id_propuesta: id },
            include: INCLUDE_PROPUESTA,
        });
        return row ? PropuestaMapper.toDomain(row) : null;
    }

    async obtenerPorUsuario(idUsuario: string): Promise<Propuesta[]> {
        const rows = await this.prisma.propuesta.findMany({
            where: {
                OR: [
                    { solicitud_1: { id_usuario: idUsuario } },
                    { solicitud_2: { id_usuario: idUsuario } },
                ],
            },
            include: INCLUDE_PROPUESTA,
            orderBy: { fecha_match: 'desc' },
        });
        return rows.map(row => PropuestaMapper.toDomain(row));
    }

    async obtenerTodas(): Promise<Propuesta[]> {
        const rows = await this.prisma.propuesta.findMany({
            include: INCLUDE_PROPUESTA,
            orderBy: { fecha_match: 'desc' },
        });
        return rows.map(row => PropuestaMapper.toDomain(row));
    }

    async guardar(idSolicitud1: number, idSolicitud2: number): Promise<Propuesta> {
        const row = await this.prisma.propuesta.create({
            data: {
                id_solicitud_1: idSolicitud1,
                id_solicitud_2: idSolicitud2,
                fecha_match:    new Date(),
            },
            include: INCLUDE_PROPUESTA,
        });
        return PropuestaMapper.toDomain(row);
    }

    async actualizarVoto(idPropuesta: number, numeroAlumno: 1 | 2, voto: string): Promise<Propuesta> {
        const data = numeroAlumno === 1
            ? { estado_alumno_1: voto }
            : { estado_alumno_2: voto };

        const row = await this.prisma.propuesta.update({
            where:   { id_propuesta: idPropuesta },
            data,
            include: INCLUDE_PROPUESTA,
        });
        return PropuestaMapper.toDomain(row);
    }

    async actualizarEstadoGeneral(idPropuesta: number, estado: string): Promise<void> {
        await this.prisma.propuesta.update({
            where: { id_propuesta: idPropuesta },
            data:  { estado_general: estado },
        });
    }

    async buscarEspejos(
        idComisionOrigen: number,
        idComisionDestino: number,
        idUsuarioExcluido: string,
    ): Promise<SolicitudIntercambio[]> {
        const rows = await this.prisma.$queryRaw<any[]>`
            SELECT * FROM buscar_espejos_disponibles(
                ${idComisionOrigen}::integer,
                ${idComisionDestino}::integer,
                ${idUsuarioExcluido}::uuid
            )
        `;
        return rows.map(row => SolicitudIntercambioMapper.toDomain(row));
    }

    async ejecutarIntercambio(idPropuesta: number): Promise<void> {
        await this.prisma.$executeRaw`CALL ejecutar_intercambio(${idPropuesta}::integer)`;
    }
}
