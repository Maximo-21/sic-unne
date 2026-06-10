import { Module } from '@nestjs/common';
import { AuthControlador } from './infrastructure/controllers/AuthControlador';
import { LoginServicio }   from './application/services/LoginServicio';
import { UsuariosModule }  from '../usuarios/usuarios.module';

@Module({
    imports:     [UsuariosModule],
    controllers: [AuthControlador],
    providers:   [LoginServicio],
})
export class AuthModule { }
