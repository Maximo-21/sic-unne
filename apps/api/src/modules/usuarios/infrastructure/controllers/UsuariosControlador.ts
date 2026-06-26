import { Controller, Get, Post, Patch, Param, Body, NotFoundException, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../../../auth/infrastructure/guards/AdminGuard';
import { ObtenerUsuariosServicio }      from '../../application/services/ObtenerUsuariosServicio';
import { ObtenerUsuarioPorDniServicio } from '../../application/services/ObtenerUsuarioPorDniServicio';
import { CrearUsuarioServicio }         from '../../application/services/CrearUsuarioServicio';
import { ActualizarUsuarioServicio }    from '../../application/services/ActualizarUsuarioServicio';
import { DarDeBajaUsuarioServicio }     from '../../application/services/DarDeBajaUsuarioServicio';
import { ActivarUsuarioServicio }       from '../../application/services/ActivarUsuarioServicio';
import { CrearUsuarioDto }              from '../../application/dto/CrearUsuarioDto';
import { ActualizarUsuarioDto }         from '../../application/dto/ActualizarUsuarioDto';
import { UsuarioMapper }                from '../../application/mappers/UsuarioMapper';

/**
 * Controlador de gestión de usuarios. Todas las rutas requieren rol `admin`.
 *
 * Base URL: `/usuarios`
 *
 * Implementa los contratos HU1: `crearUsuario`, `actualizarUsuario`, `darDeBaja`.
 */
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

    /**
     * `GET /usuarios` — Lista todos los usuarios del sistema.
     * @returns array de `UsuarioResponseDto` sin contraseñas
     */
    @Get()
    async obtenerTodos() {
        const usuarios = await this.obtenerUsuariosServicio.ejecutar();
        const data = usuarios.map(u => UsuarioMapper.toDto(u));
        return { status: 'OK', cantidad: data.length, data };
    }

    /**
     * `GET /usuarios/:dni` — Busca un usuario por su DNI.
     * @throws 404 si no existe un usuario con ese DNI
     */
    @Get(':dni')
    async obtenerPorDni(@Param('dni') dni: string) {
        const usuario = await this.obtenerUsuarioPorDniServicio.ejecutar(dni);
        if (!usuario) throw new NotFoundException(`No se encontró el usuario con DNI: ${dni}`);
        return { status: 'OK', data: UsuarioMapper.toDto(usuario) };
    }

    /**
     * `POST /usuarios` — Da de alta un nuevo usuario en el sistema (HU1 — crearUsuario).
     * @throws 409 si ya existe un usuario con el mismo DNI
     */
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async crear(@Body() dto: CrearUsuarioDto) {
        const usuario = await this.crearUsuarioServicio.ejecutar(dto);
        return { status: 'OK', data: usuario };
    }

    /**
     * `PATCH /usuarios/:id` — Actualiza datos de un usuario activo (HU1 — actualizarUsuario).
     * @throws 404 si no existe | 400 si está inactivo
     */
    @Patch(':id')
    async actualizar(@Param('id') id: string, @Body() dto: ActualizarUsuarioDto) {
        const usuario = await this.actualizarUsuarioServicio.ejecutar(id, dto);
        return { status: 'OK', data: usuario };
    }

    /**
     * `PATCH /usuarios/:id/desactivar` — Baja lógica de un usuario activo (HU1 — darDeBaja).
     * @throws 404 si no existe | 400 si ya está inactivo
     */
    @Patch(':id/desactivar')
    async darDeBaja(@Param('id') id: string) {
        await this.darDeBajaUsuarioServicio.ejecutar(id);
        return { status: 'OK', message: 'Usuario desactivado correctamente.' };
    }

    /**
     * `PATCH /usuarios/:id/activar` — Reactiva un usuario inactivo.
     * @throws 404 si no existe
     */
    @Patch(':id/activar')
    async activar(@Param('id') id: string) {
        await this.activarUsuarioServicio.ejecutar(id);
        return { status: 'OK', message: 'Usuario activado correctamente.' };
    }
}
