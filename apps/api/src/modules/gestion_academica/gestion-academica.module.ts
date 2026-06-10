import { Module } from '@nestjs/common';
import { AdminGuard }       from '../auth/infrastructure/guards/AdminGuard';
import { EstudianteGuard }  from '../auth/infrastructure/guards/EstudianteGuard';
import { AutenticadoGuard } from '../auth/infrastructure/guards/AutenticadoGuard';
import { GestionAcademicaControlador }           from './infrastructure/controllers/GestionAcademicaControlador';
import { CrearInscripcionServicio }               from './application/services/CrearInscripcionServicio';
import { ObtenerInscripcionesEstudianteServicio } from './application/services/ObtenerInscripcionesEstudianteServicio';
import { ObtenerInscripcionesAdminServicio }      from './application/services/ObtenerInscripcionesAdminServicio';
import { ObtenerComisionesServicio }              from './application/services/ObtenerComisionesServicio';
import { ObtenerAsignaturasServicio }             from './application/services/ObtenerAsignaturasServicio';
import { ObtenerHorariosServicio }                from './application/services/ObtenerHorariosServicio';
import { PrismaRepositorioInscripcion }           from './infrastructure/persistence/PrismaRepositorioInscripcion';
import { PrismaRepositorioComision }              from './infrastructure/persistence/PrismaRepositorioComision';
import { PrismaRepositorioAsignatura }            from './infrastructure/persistence/PrismaRepositorioAsignatura';
import { PrismaRepositorioHorario }               from './infrastructure/persistence/PrismaRepositorioHorario';

@Module({
    controllers: [GestionAcademicaControlador],
    providers: [
        AdminGuard,
        EstudianteGuard,
        AutenticadoGuard,
        CrearInscripcionServicio,
        ObtenerInscripcionesEstudianteServicio,
        ObtenerInscripcionesAdminServicio,
        ObtenerComisionesServicio,
        ObtenerAsignaturasServicio,
        ObtenerHorariosServicio,
        { provide: 'IRepositorioInscripcion', useClass: PrismaRepositorioInscripcion },
        { provide: 'IRepositorioComision',    useClass: PrismaRepositorioComision    },
        { provide: 'IRepositorioAsignatura',  useClass: PrismaRepositorioAsignatura  },
        { provide: 'IRepositorioHorario',     useClass: PrismaRepositorioHorario     },
    ],
    exports: ['IRepositorioInscripcion'],
})
export class GestionAcademicaModule { }
