import { Injectable, Inject, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { IRepositorioUsuario } from '../../domain/repositories/IRepositorioUsuario';
import { Usuario } from '../../domain/entities/Usuario';
import { CrearUsuarioDto } from '../dto/crear-usuario.dto';
import { UsuarioResponseDto } from '../dto/usuario-response.dto';
import { UsuarioMapper } from '../mappers/UsuarioMapper';

@Injectable()
export class CrearUsuarioServicio {
    constructor(
        @Inject('IRepositorioUsuario')
        private readonly repositorio: IRepositorioUsuario
    ) { }

    async ejecutar(dto: CrearUsuarioDto): Promise<UsuarioResponseDto> {
        const existente = await this.repositorio.buscarPorDni(dto.dni);
        if (existente) {
            throw new ConflictException(`El usuario con DNI ${dto.dni} ya existe.`);
        }

        const claveHasheada = await bcrypt.hash(dto.contrasena, 10);

        const nuevoUsuario = new Usuario(
            crypto.randomUUID(),
            dto.dni,
            dto.nombre,
            dto.apellido,
            dto.email,
            claveHasheada,
            dto.carrera ?? null,
            dto.idRol,
            null,
            'activo',
            new Date(),
        );

        const guardado = await this.repositorio.guardar(nuevoUsuario);
        return UsuarioMapper.toDto(guardado);
    }
}
