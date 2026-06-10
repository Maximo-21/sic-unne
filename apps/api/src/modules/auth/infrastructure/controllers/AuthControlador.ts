import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { LoginServicio } from '../../application/services/LoginServicio';
import { LoginDto }      from '../../application/dto/LoginDto';

@Controller('auth')
export class AuthControlador {
    constructor(private readonly loginServicio: LoginServicio) { }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() dto: LoginDto) {
        const usuario = await this.loginServicio.ejecutar(dto);
        return { status: 'OK', data: usuario };
    }
}
