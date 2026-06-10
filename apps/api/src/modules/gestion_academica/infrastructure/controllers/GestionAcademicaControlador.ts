import {
    Controller, Get, Post,
    Body, Query, Headers,
    BadRequestException, UseGuards,
} from '@nestjs/common';
import { AdminGuard }        from '../../../auth/infrastructure/guards/AdminGuard';
import { EstudianteGuard }   from '../../../auth/infrastructure/guards/EstudianteGuard';
import { AutenticadoGuard }  from '../../../auth/infrastructure/guards/AutenticadoGuard';
import { CrearInscripcionServicio }                from '../../application/services/CrearInscripcionServicio';
import { ObtenerInscripcionesEstudianteServicio }  from '../../application/services/ObtenerInscripcionesEstudianteServicio';
import { ObtenerInscripcionesAdminServicio }       from '../../application/services/ObtenerInscripcionesAdminServicio';
import { ObtenerComisionesServicio }               from '../../application/services/ObtenerComisionesServicio';
import { ObtenerAsignaturasServicio }              from '../../application/services/ObtenerAsignaturasServicio';
import { ObtenerHorariosServicio }                 from '../../application/services/ObtenerHorariosServicio';
import { CrearInscripcionDto }                     from '../../application/dto/CrearInscripcionDto';

@Controller('academico')
export class GestionAcademicaControlador {
    constructor(
        private readonly crearInscripcionServicio:               CrearInscripcionServicio,
        private readonly obtenerInscripcionesEstudianteServicio: ObtenerInscripcionesEstudianteServicio,
        private readonly obtenerInscripcionesAdminServicio:      ObtenerInscripcionesAdminServicio,
        private readonly obtenerComisionesServicio:              ObtenerComisionesServicio,
        private readonly obtenerAsignaturasServicio:             ObtenerAsignaturasServicio,
        private readonly obtenerHorariosServicio:                ObtenerHorariosServicio,
    ) { }

    // TODO: swap @Headers('x-user-id') → @Req() req / req.user.sub al integrar JwtAuthGuard
    @Post('inscripciones')
    @UseGuards(EstudianteGuard)
    async crearInscripcion(
        @Headers('x-user-id') idUsuario: string,
        @Body() dto: CrearInscripcionDto,
    ) {
        if (!idUsuario) throw new BadRequestException('Header x-user-id requerido.');
        const inscripcion = await this.crearInscripcionServicio.ejecutar(idUsuario, dto);
        return { status: 'OK', data: inscripcion };
    }

    @Get('inscripciones/me')
    @UseGuards(EstudianteGuard)
    async obtenerMisInscripciones(@Headers('x-user-id') idUsuario: string) {
        if (!idUsuario) throw new BadRequestException('Header x-user-id requerido.');
        const inscripciones = await this.obtenerInscripcionesEstudianteServicio.ejecutar(idUsuario);
        return { status: 'OK', cantidad: inscripciones.length, data: inscripciones };
    }

    @Get('inscripciones')
    @UseGuards(AdminGuard)
    async obtenerTodasInscripciones() {
        const inscripciones = await this.obtenerInscripcionesAdminServicio.ejecutar();
        return { status: 'OK', cantidad: inscripciones.length, data: inscripciones };
    }

    @Get('comisiones')
    @UseGuards(AutenticadoGuard)
    async obtenerComisiones(@Query('idAsignatura') idAsignatura?: string) {
        const id = idAsignatura ? parseInt(idAsignatura, 10) : undefined;
        const comisiones = await this.obtenerComisionesServicio.ejecutar(id);
        return { status: 'OK', cantidad: comisiones.length, data: comisiones };
    }

    @Get('asignaturas')
    @UseGuards(AutenticadoGuard)
    async obtenerAsignaturas() {
        const asignaturas = await this.obtenerAsignaturasServicio.ejecutar();
        return { status: 'OK', cantidad: asignaturas.length, data: asignaturas };
    }

    @Get('horarios')
    @UseGuards(AutenticadoGuard)
    async obtenerHorarios(@Query('idComision') idComision?: string) {
        const id = idComision ? parseInt(idComision, 10) : undefined;
        const horarios = await this.obtenerHorariosServicio.ejecutar(id);
        return { status: 'OK', cantidad: horarios.length, data: horarios };
    }
}
