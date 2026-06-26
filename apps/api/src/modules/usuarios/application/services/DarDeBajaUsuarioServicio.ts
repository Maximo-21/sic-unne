import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { IRepositorioUsuario } from '../../domain/repositories/IRepositorioUsuario';

/**
 * Caso de uso: **Dar de Baja Usuario** — baja lógica (contrato `darDeBaja` del documento SIC-UNNE).
 *
 * Pre-condiciones:
 * - El usuario debe existir.
 * - El usuario debe estar en estado `'activo'` (idempotencia: no se da de baja dos veces).
 *
 * Post-condiciones:
 * - El usuario pasa a estado `'inactivo'`. No se elimina el registro de la BD.
 *
 * @throws {NotFoundException}   si el id no corresponde a ningún usuario
 * @throws {BadRequestException} si el usuario ya está inactivo
 */
@Injectable()
export class DarDeBajaUsuarioServicio {
    constructor(
        @Inject('IRepositorioUsuario')
        private readonly repositorio: IRepositorioUsuario
    ) { }

    /**
     * Marca al usuario como inactivo (baja lógica).
     * @param id_usuario — UUID del usuario a desactivar
     */
    async ejecutar(id_usuario: string): Promise<void> {
        const usuario = await this.repositorio.buscarPorId(id_usuario);
        if (!usuario) {
            throw new NotFoundException(`No se encontró el usuario con ID: ${id_usuario}`);
        }
        if (!usuario.estaActivo()) {
            throw new BadRequestException('El usuario ya se encuentra inactivo.');
        }
        await this.repositorio.darDeBaja(id_usuario);
    }
}
