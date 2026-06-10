import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { IRepositorioUsuario } from '../../../usuarios/domain/repositories/IRepositorioUsuario';
import { UsuarioResponseDto }  from '../../../usuarios/application/dto/usuario-response.dto';
import { UsuarioMapper }       from '../../../usuarios/application/mappers/UsuarioMapper';
import { LoginDto } from '../../dto/login.dto';

@Injectable()
export class LoginServicio {
    constructor(
        @Inject('IRepositorioUsuario')
        private readonly repositorio: IRepositorioUsuario
    ) { }

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
