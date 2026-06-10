import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IRepositorioUsuario } from '../../domain/repositories/IRepositorioUsuario';
import { ActualizarUsuarioDto } from '../dto/ActualizarUsuarioDto';
import { UsuarioResponseDto } from '../dto/UsuarioResponseDto';
import { UsuarioMapper } from '../mappers/UsuarioMapper';

@Injectable()
export class ActualizarUsuarioServicio {
    constructor(
        @Inject('IRepositorioUsuario')
        private readonly repositorio: IRepositorioUsuario
    ) { }

    async ejecutar(id_usuario: string, dto: ActualizarUsuarioDto): Promise<UsuarioResponseDto> {
        const usuario = await this.repositorio.buscarPorId(id_usuario);
        if (!usuario) {
            throw new NotFoundException(`No se encontró el usuario con ID: ${id_usuario}`);
        }
        const actualizado = await this.repositorio.actualizar(id_usuario, dto);
        return UsuarioMapper.toDto(actualizado);
    }
}
