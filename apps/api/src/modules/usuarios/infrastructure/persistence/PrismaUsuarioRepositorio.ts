import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/prisma.service';
import { IRepositorioUsuario } from '../../domain/repositories/IRepositorioUsuario';
import { Usuario } from '../../domain/entities/Usuario';
import { UsuarioMapper } from '../../application/mappers/UsuarioMapper';

@Injectable()
export class PrismaUsuarioRepositorio implements IRepositorioUsuario {
    constructor(private readonly prisma: PrismaService) { }

    async obtenerTodos(): Promise<Usuario[]> {
        const rows = await this.prisma.usuario.findMany({ include: { rol: true } });
        return rows.map(u => UsuarioMapper.toDomain(u));
    }

    async buscarPorId(id_usuario: string): Promise<Usuario | null> {
        const u = await this.prisma.usuario.findUnique({
            where: { id_usuario },
            include: { rol: true },
        });
        return u ? UsuarioMapper.toDomain(u) : null;
    }

    async buscarPorDni(dni: string): Promise<Usuario | null> {
        const u = await this.prisma.usuario.findUnique({
            where: { dni },
            include: { rol: true },
        });
        return u ? UsuarioMapper.toDomain(u) : null;
    }

    async guardar(usuario: Usuario): Promise<Usuario> {
        const u = await this.prisma.usuario.create({
            data: {
                id_usuario: usuario.id,
                dni:        usuario.dni,
                nombre:     usuario.nombre,
                apellido:   usuario.apellido,
                email:      usuario.email,
                contrasena: usuario.contraseña,
                carrera:    usuario.carrera,
                estado:     usuario.estado,
                id_rol:     usuario.idRol,
            },
            include: { rol: true },
        });
        return UsuarioMapper.toDomain(u);
    }

    async actualizar(id_usuario: string, datos: any): Promise<Usuario> {
        const u = await this.prisma.usuario.update({
            where: { id_usuario },
            data: {
                ...(datos.nombre   !== undefined && { nombre:   datos.nombre }),
                ...(datos.apellido !== undefined && { apellido: datos.apellido }),
                ...(datos.email    !== undefined && { email:    datos.email }),
                ...(datos.carrera  !== undefined && { carrera:  datos.carrera }),
                ...(datos.idRol    !== undefined && { id_rol:   datos.idRol }),
            },
            include: { rol: true },
        });
        return UsuarioMapper.toDomain(u);
    }

    async darDeBaja(id_usuario: string): Promise<void> {
        await this.prisma.usuario.update({
            where: { id_usuario },
            data: { estado: 'inactivo' },
        });
    }

    async activar(id_usuario: string): Promise<void> {
        await this.prisma.usuario.update({
            where: { id_usuario },
            data: { estado: 'activo' },
        });
    }
}
