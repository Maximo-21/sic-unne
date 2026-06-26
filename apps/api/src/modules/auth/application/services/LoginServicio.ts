import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { IRepositorioUsuario } from '../../../usuarios/domain/repositories/IRepositorioUsuario';
import { UsuarioResponseDto }  from '../../../usuarios/application/dto/UsuarioResponseDto';
import { UsuarioMapper }       from '../../../usuarios/application/mappers/UsuarioMapper';
import { LoginDto } from '../dto/LoginDto';

/**
 * Caso de uso: **Autenticación** — verifica credenciales y retorna los datos del usuario.
 *
 * Seguridad: el mensaje de error es idéntico para "usuario inexistente" y "contraseña incorrecta"
 * para evitar la enumeración de usuarios (timing-safe mediante bcrypt.compare).
 *
 * @throws {UnauthorizedException} si las credenciales son incorrectas o el usuario está inactivo
 */
@Injectable()
export class LoginServicio {
    constructor(
        @Inject('IRepositorioUsuario')
        private readonly repositorio: IRepositorioUsuario
    ) { }

    /**
     * Valida DNI y contraseña; retorna el perfil del usuario autenticado.
     * @param dto — credenciales (`dni` y `clave` en texto plano)
     * @returns DTO con los datos del usuario (sin contraseña)
     */
    async ejecutar(dto: LoginDto): Promise<UsuarioResponseDto> {
        const usuario = await this.repositorio.buscarPorDni(dto.dni);

        // Mismo mensaje para "no existe" y "contraseña incorrecta" para evitar enumeración de usuarios
        if (!usuario || !(await bcrypt.compare(dto.clave, usuario.contraseña))) {
            throw new UnauthorizedException('DNI o contraseña incorrectos.');
        }

        if (usuario.estado === 'inactivo') {
            throw new UnauthorizedException('Tu cuenta está desactivada. Contactá con el administrador.');
        }

        return UsuarioMapper.toDto(usuario);
    }
}
