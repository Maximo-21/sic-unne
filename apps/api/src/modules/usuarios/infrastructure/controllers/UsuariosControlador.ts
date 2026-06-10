import { Controller, Get, Post, Patch, Param, Body, NotFoundException, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../../../auth/guards/AdminGuard';
import { ObtenerUsuariosServicio }      from '../../application/services/ObtenerUsuariosServicio';
import { ObtenerUsuarioPorDniServicio } from '../../application/services/ObtenerUsuarioPorDniServicio';
import { CrearUsuarioServicio }         from '../../application/services/CrearUsuarioServicio';
import { ActualizarUsuarioServicio }    from '../../application/services/ActualizarUsuarioServicio';
import { DarDeBajaUsuarioServicio }     from '../../application/services/DarDeBajaUsuarioServicio';
import { ActivarUsuarioServicio }       from '../../application/services/ActivarUsuarioServicio';
import { CrearUsuarioDto }              from '../../application/dto/crear-usuario.dto';
import { ActualizarUsuarioDto }         from '../../application/dto/actualizar-usuario.dto';
import { UsuarioMapper }                from '../../application/mappers/UsuarioMapper';

@Controller('usuarios')
@UseGuards(AdminGuard)
export class UsuariosControlador {
    constructor(
        private readonly obtenerUsuariosServicio:      ObtenerUsuariosServicio,
        private readonly obtenerUsuarioPorDniServicio: ObtenerUsuarioPorDniServicio,
        private readonly crearUsuarioServicio:         CrearUsuarioServicio,
        private readonly actualizarUsuarioServicio:    ActualizarUsuarioServicio,
        private readonly darDeBajaUsuarioServicio:     DarDeBajaUsuarioServicio,
        private readonly activarUsuarioServicio:       ActivarUsuarioServicio,
    ) { }

    @Get()
    async obtenerTodos() {
        const usuarios = await this.obtenerUsuariosServicio.ejecutar();
        const data = usuarios.map(u => UsuarioMapper.toDto(u));
        return { status: 'OK', cantidad: data.length, data };
    }

    @Get(':dni')
    async obtenerPorDni(@Param('dni') dni: string) {
        const usuario = await this.obtenerUsuarioPorDniServicio.ejecutar(dni);
        if (!usuario) throw new NotFoundException(`No se encontró el usuario con DNI: ${dni}`);
        return { status: 'OK', data: UsuarioMapper.toDto(usuario) };
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async crear(@Body() dto: CrearUsuarioDto) {
        const usuario = await this.crearUsuarioServicio.ejecutar(dto);
        return { status: 'OK', data: usuario };
    }

    @Patch(':id')
    async actualizar(@Param('id') id: string, @Body() dto: ActualizarUsuarioDto) {
        const usuario = await this.actualizarUsuarioServicio.ejecutar(id, dto);
        return { status: 'OK', data: usuario };
    }

    @Patch(':id/desactivar')
    async darDeBaja(@Param('id') id: string) {
        await this.darDeBajaUsuarioServicio.ejecutar(id);
        return { status: 'OK', message: 'Usuario desactivado correctamente.' };
    }

    @Patch(':id/activar')
    async activar(@Param('id') id: string) {
        await this.activarUsuarioServicio.ejecutar(id);
        return { status: 'OK', message: 'Usuario activado correctamente.' };
    }
}
