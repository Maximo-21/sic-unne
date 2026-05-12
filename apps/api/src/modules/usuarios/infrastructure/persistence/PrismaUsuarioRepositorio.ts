import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/prisma.service';
import { UsuarioRepositorio } from '../../domain/repositories/UsuarioRepositorio';
import { Usuario } from '../../domain/entities/Usuario';

@Injectable()
export class PrismaUsuarioRepositorio implements UsuarioRepositorio {
    constructor(private readonly prisma: PrismaService) { }

    async obtenerTodos(): Promise<Usuario[]> {
        const usuariosDb = await this.prisma.usuario.findMany();
        // Aquí tu compañero mapeará los datos a la Entidad Usuario
        return usuariosDb.map(u => new Usuario(
            u.id_usuario, u.dni, u.nombre, u.apellido, u.email,
            u.contrasena, u.rol, u.estado, u.fecha_registro
        ));
    }

    async buscarPorId(id_usuario: string): Promise<Usuario | null> {
        const u = await this.prisma.usuario.findUnique({ where: { id_usuario } });
        if (!u) return null;
        return new Usuario(u.id_usuario, u.dni, u.nombre, u.apellido, u.email, u.contrasena, u.rol, u.estado, u.fecha_registro);
    }

    async guardar(usuario: Usuario): Promise<Usuario> {
        // Tu compañero implementará el this.prisma.usuario.create aquí
        throw new Error('Método no implementado');
    }

    async actualizar(id_usuario: string, datos: any): Promise<Usuario> {
        // Tu compañero implementará el this.prisma.usuario.update aquí
        throw new Error('Método no implementado');
    }

    async darDeBaja(id_usuario: string): Promise<void> {
        await this.prisma.usuario.update({
            where: { id_usuario },
            data: { estado: 'inactivo' } // Baja lógica
        });
    }

    async activar(id_usuario: string): Promise<void> {
        await this.prisma.usuario.update({
            where: { id_usuario },
            data: { estado: 'activo' } // Alta lógica
        });
    }

    async buscarPorDni(dni: string): Promise<Usuario | null> {
        const u = await this.prisma.usuario.findUnique({
            where: { dni } // Aprovechamos que el DNI es único en la DB
        });

        if (!u) return null;

        return new Usuario(
            u.id_usuario, u.dni, u.nombre, u.apellido, u.email,
            u.contrasena, u.rol, u.estado, u.fecha_registro
        );
    }
}