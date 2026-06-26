import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { IRepositorioUsuario } from '../../domain/repositories/IRepositorioUsuario';
import { ActualizarUsuarioDto } from '../dto/ActualizarUsuarioDto';
import { UsuarioResponseDto } from '../dto/UsuarioResponseDto';
import { UsuarioMapper } from '../mappers/UsuarioMapper';

/**
 * Caso de uso: **Actualizar Usuario** (contrato `actualizarUsuario` del documento SIC-UNNE).
 *
 * Pre-condiciones:
 * - El usuario debe existir.
 * - El usuario debe estar en estado `'activo'` (no se modifican usuarios dados de baja).
 *
 * @throws {NotFoundException}   si el id no corresponde a ningún usuario
 * @throws {BadRequestException} si el usuario está inactivo
 */
@Injectable()
export class ActualizarUsuarioServicio {
    constructor(
        @Inject('IRepositorioUsuario')
        private readonly repositorio: IRepositorioUsuario
    ) { }

    /**
     * Aplica los cambios del DTO sobre el usuario identificado por `id_usuario`.
     * @param id_usuario — UUID del usuario a actualizar
     * @param dto        — campos a modificar (todos opcionales)
     * @returns DTO con los datos actualizados del usuario
     */
    async ejecutar(id_usuario: string, dto: ActualizarUsuarioDto): Promise<UsuarioResponseDto> {
        const usuario = await this.repositorio.buscarPorId(id_usuario);
        if (!usuario) {
            throw new NotFoundException(`No se encontró el usuario con ID: ${id_usuario}`);
        }
        if (!usuario.estaActivo()) {
            throw new BadRequestException('No se puede modificar un usuario inactivo.');
        }
        const actualizado = await this.repositorio.actualizar(id_usuario, dto);
        return UsuarioMapper.toDto(actualizado);
    }
}
