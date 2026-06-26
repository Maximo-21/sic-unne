import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { LoginServicio } from '../../application/services/LoginServicio';
import { LoginDto }      from '../../application/dto/LoginDto';

/**
 * Controlador de autenticación. Expone el endpoint público de login.
 *
 * Base URL: `/auth`
 */
@Controller('auth')
export class AuthControlador {
    constructor(private readonly loginServicio: LoginServicio) { }

    /**
     * `POST /auth/login` — Autentica a un usuario por DNI y contraseña.
     *
     * @returns `{ status: 'OK', data: UsuarioResponseDto }` — perfil del usuario sin contraseña
     * @throws 401 si las credenciales son incorrectas o el usuario está inactivo
     */
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() dto: LoginDto) {
        const usuario = await this.loginServicio.ejecutar(dto);
        return { status: 'OK', data: usuario };
    }
}
