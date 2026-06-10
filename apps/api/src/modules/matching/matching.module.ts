import { Module }                                 from '@nestjs/common';
import { AdminGuard }      from '../auth/guards/AdminGuard';
import { EstudianteGuard } from '../auth/guards/EstudianteGuard';
import { GestionAcademicaModule }                from '../gestion_academica/gestion-academica.module';
import { PrismaSolicitudIntercambioRepositorio } from './infrastructure/persistence/PrismaSolicitudIntercambioRepositorio';
import { PrismaPropuestaRepositorio }            from './infrastructure/persistence/PrismaPropuestaRepositorio';
import { CrearSolicitudServicio }                from './application/services/CrearSolicitudServicio';
import { VotarPropuestaServicio }                from './application/services/VotarPropuestaServicio';
import { CancelarSolicitudServicio }             from './application/services/CancelarSolicitudServicio';
import { ObtenerSolicitudesEstudianteServicio }  from './application/services/ObtenerSolicitudesEstudianteServicio';
import { ObtenerPropuestasEstudianteServicio }   from './application/services/ObtenerPropuestasEstudianteServicio';
import { ObtenerPropuestasAdminServicio }        from './application/services/ObtenerPropuestasAdminServicio';
import { MatchingControlador }                   from './infrastructure/controllers/MatchingControlador';

@Module({
    imports: [GestionAcademicaModule],
    controllers: [MatchingControlador],
    providers: [
        AdminGuard,
        EstudianteGuard,
        CrearSolicitudServicio,
        VotarPropuestaServicio,
        CancelarSolicitudServicio,
        ObtenerSolicitudesEstudianteServicio,
        ObtenerPropuestasEstudianteServicio,
        ObtenerPropuestasAdminServicio,
        {
            provide:  'IRepositorioSolicitudIntercambio',
            useClass: PrismaSolicitudIntercambioRepositorio,
        },
        {
            provide:  'IRepositorioPropuesta',
            useClass: PrismaPropuestaRepositorio,
        },
    ],
})
export class MatchingModule {}
