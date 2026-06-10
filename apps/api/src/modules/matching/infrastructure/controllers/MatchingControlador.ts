import {
    Controller, Get, Post, Patch, Delete,
    Param, Body, Headers, ParseIntPipe, HttpCode, HttpStatus,
    BadRequestException, UseGuards,
} from '@nestjs/common';
import { AdminGuard }      from '../../../auth/guards/AdminGuard';
import { EstudianteGuard } from '../../../auth/guards/EstudianteGuard';
import { CrearSolicitudServicio }                from '../../application/services/CrearSolicitudServicio';
import { VotarPropuestaServicio }                from '../../application/services/VotarPropuestaServicio';
import { CancelarSolicitudServicio }             from '../../application/services/CancelarSolicitudServicio';
import { ObtenerSolicitudesEstudianteServicio }  from '../../application/services/ObtenerSolicitudesEstudianteServicio';
import { ObtenerPropuestasEstudianteServicio }   from '../../application/services/ObtenerPropuestasEstudianteServicio';
import { ObtenerPropuestasAdminServicio }        from '../../application/services/ObtenerPropuestasAdminServicio';
import { CrearSolicitudDto }                     from '../../application/dto/crear-solicitud.dto';
import { VotarPropuestaDto }                     from '../../application/dto/votar-propuesta.dto';

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

    // TODO: swap @Headers('x-user-id') → @Req() req / req.user.sub al integrar JwtAuthGuard
    @Get('solicitudes/me')
    @UseGuards(EstudianteGuard)
    async obtenerMisSolicitudes(@Headers('x-user-id') idUsuario: string) {
        if (!idUsuario) throw new BadRequestException('Header x-user-id requerido.');
        const solicitudes = await this.obtenerSolicitudesEstudianteServicio.ejecutar(idUsuario);
        return { status: 'OK', cantidad: solicitudes.length, data: solicitudes };
    }

    @Get('propuestas/me')
    @UseGuards(EstudianteGuard)
    async obtenerMisPropuestas(@Headers('x-user-id') idUsuario: string) {
        if (!idUsuario) throw new BadRequestException('Header x-user-id requerido.');
        const propuestas = await this.obtenerPropuestasEstudianteServicio.ejecutar(idUsuario);
        return { status: 'OK', cantidad: propuestas.length, data: propuestas };
    }

    @Get('propuestas')
    @UseGuards(AdminGuard)
    async obtenerTodasPropuestas() {
        const propuestas = await this.obtenerPropuestasAdminServicio.ejecutar();
        return { status: 'OK', cantidad: propuestas.length, data: propuestas };
    }

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
