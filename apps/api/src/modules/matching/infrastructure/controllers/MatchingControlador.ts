import {
    Controller, Get, Post, Patch, Delete,
    Param, Body, Headers, ParseIntPipe, HttpCode, HttpStatus,
    BadRequestException, UseGuards,
} from '@nestjs/common';
import { AdminGuard }      from '../../../auth/infrastructure/guards/AdminGuard';
import { EstudianteGuard } from '../../../auth/infrastructure/guards/EstudianteGuard';
import { CrearSolicitudServicio }                from '../../application/services/CrearSolicitudServicio';
import { VotarPropuestaServicio }                from '../../application/services/VotarPropuestaServicio';
import { CancelarSolicitudServicio }             from '../../application/services/CancelarSolicitudServicio';
import { ObtenerSolicitudesEstudianteServicio }  from '../../application/services/ObtenerSolicitudesEstudianteServicio';
import { ObtenerPropuestasEstudianteServicio }   from '../../application/services/ObtenerPropuestasEstudianteServicio';
import { ObtenerPropuestasAdminServicio }        from '../../application/services/ObtenerPropuestasAdminServicio';
import { CrearSolicitudDto }                     from '../../application/dto/CrearSolicitudDto';
import { VotarPropuestaDto }                     from '../../application/dto/VotarPropuestaDto';

/**
 * Controlador del módulo Matching. Gestiona solicitudes de intercambio y propuestas de match.
 *
 * Base URL: `/matching`
 *
 * Implementa HU3 (crear solicitud), HU4 (matching automático) y HU5 (votar propuesta).
 *
 * @note El identificador del usuario se obtiene del header `x-user-id` (temporal).
 *       Cuando se integre `JwtAuthGuard`, debe reemplazarse por `@Req() req` / `req.user.sub`.
 */
@Controller('matching')
export class MatchingControlador {
    constructor(
        private readonly crearSolicitudServicio:               CrearSolicitudServicio,
        private readonly votarPropuestaServicio:               VotarPropuestaServicio,
        private readonly cancelarSolicitudServicio:            CancelarSolicitudServicio,
        private readonly obtenerSolicitudesEstudianteServicio: ObtenerSolicitudesEstudianteServicio,
        private readonly obtenerPropuestasEstudianteServicio:  ObtenerPropuestasEstudianteServicio,
        private readonly obtenerPropuestasAdminServicio:       ObtenerPropuestasAdminServicio,
    ) {}

    /**
     * `GET /matching/solicitudes/me` — Retorna todas las solicitudes del alumno autenticado.
     */
    // TODO: swap @Headers('x-user-id') → @Req() req / req.user.sub al integrar JwtAuthGuard
    @Get('solicitudes/me')
    @UseGuards(EstudianteGuard)
    async obtenerMisSolicitudes(@Headers('x-user-id') idUsuario: string) {
        if (!idUsuario) throw new BadRequestException('Header x-user-id requerido.');
        const solicitudes = await this.obtenerSolicitudesEstudianteServicio.ejecutar(idUsuario);
        return { status: 'OK', cantidad: solicitudes.length, data: solicitudes };
    }

    /**
     * `GET /matching/propuestas/me` — Retorna las propuestas en las que participa el alumno autenticado.
     */
    @Get('propuestas/me')
    @UseGuards(EstudianteGuard)
    async obtenerMisPropuestas(@Headers('x-user-id') idUsuario: string) {
        if (!idUsuario) throw new BadRequestException('Header x-user-id requerido.');
        const propuestas = await this.obtenerPropuestasEstudianteServicio.ejecutar(idUsuario);
        return { status: 'OK', cantidad: propuestas.length, data: propuestas };
    }

    /**
     * `GET /matching/propuestas` — Lista todas las propuestas del sistema (solo admin).
     */
    @Get('propuestas')
    @UseGuards(AdminGuard)
    async obtenerTodasPropuestas() {
        const propuestas = await this.obtenerPropuestasAdminServicio.ejecutar();
        return { status: 'OK', cantidad: propuestas.length, data: propuestas };
    }

    /**
     * `POST /matching/solicitudes` — Crea una solicitud de intercambio (HU3).
     * Si existe un espejo disponible, genera automáticamente la Propuesta (HU4).
     * @returns `{ solicitud, propuesta }` — propuesta es `null` si no hubo match inmediato
     * @throws 400 si origen === destino o no hay inscripción activa
     */
    @Post('solicitudes')
    @UseGuards(EstudianteGuard)
    @HttpCode(HttpStatus.CREATED)
    async crearSolicitud(
        @Headers('x-user-id') idUsuario: string,
        @Body() dto: CrearSolicitudDto,
    ) {
        const resultado = await this.crearSolicitudServicio.ejecutar(idUsuario, dto);
        return { status: 'OK', data: resultado };
    }

    /**
     * `PATCH /matching/propuestas/:id/votar` — Registra el voto del alumno en una propuesta (HU5).
     * @throws 400 si la propuesta ya fue resuelta o el alumno ya votó | 403 si no pertenece a la propuesta
     */
    @Patch('propuestas/:id/votar')
    @UseGuards(EstudianteGuard)
    async votarPropuesta(
        @Param('id', ParseIntPipe) idPropuesta: number,
        @Headers('x-user-id') idUsuario: string,
        @Body() dto: VotarPropuestaDto,
    ) {
        const resultado = await this.votarPropuestaServicio.ejecutar(idPropuesta, idUsuario, dto);
        return { status: 'OK', data: resultado };
    }

    /**
     * `DELETE /matching/solicitudes/:id` — Cancela una solicitud pendiente del alumno autenticado.
     * @throws 400 si la solicitud no está en estado `'pendiente'` | 403 si no pertenece al alumno
     */
    @Delete('solicitudes/:id')
    @UseGuards(EstudianteGuard)
    @HttpCode(HttpStatus.OK)
    async cancelarSolicitud(
        @Param('id', ParseIntPipe) idSolicitud: number,
        @Headers('x-user-id') idUsuario: string,
    ) {
        await this.cancelarSolicitudServicio.ejecutar(idSolicitud, idUsuario);
        return { status: 'OK', message: 'Solicitud cancelada correctamente.' };
    }
}
