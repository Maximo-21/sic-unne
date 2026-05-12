import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ObtenerUsuariosServicio } from '../../application/services/ObtenerUsuariosServicio';
import { ObtenerUsuarioPorDniServicio } from '../../application/services/ObtenerUsuarioPorDniServicio';

@Controller('usuarios') // Esta será la URL base: localhost:3001/usuarios
export class UsuariosControlador {
    constructor(
        private readonly obtenerUsuariosServicio: ObtenerUsuariosServicio,
        private readonly obtenerUsuarioPorDniServicio: ObtenerUsuarioPorDniServicio,
    ) { }

    @Get()
    async obtenerTodos() {
        const usuarios = await this.obtenerUsuariosServicio.ejecutar();
        return {
            status: "OK",
            cantidad: usuarios.length,
            data: usuarios,
        };
    }

    @Get(':dni') // Ruta: localhost:3001/usuarios/12345678
    async obtenerPorDni(@Param('dni') dni: string) {
        const usuario = await this.obtenerUsuarioPorDniServicio.ejecutar(dni);

        if (!usuario) {
            // NestJS ya tiene excepciones preparadas para Ingeniería II
            throw new NotFoundException(`No se encontró el usuario con DNI: ${dni}`);
        }

        return {
            status: "OK",
            data: usuario,
        };
    }
}