import { Module } from '@nestjs/common';
import { AdminGuard } from '../auth/guards/AdminGuard';
import { UsuariosControlador }         from './infrastructure/controllers/UsuariosControlador';
import { ObtenerUsuariosServicio }     from './application/services/ObtenerUsuariosServicio';
import { ObtenerUsuarioPorDniServicio } from './application/services/ObtenerUsuarioPorDniServicio';
import { CrearUsuarioServicio }        from './application/services/CrearUsuarioServicio';
import { ActualizarUsuarioServicio }   from './application/services/ActualizarUsuarioServicio';
import { DarDeBajaUsuarioServicio }    from './application/services/DarDeBajaUsuarioServicio';
import { ActivarUsuarioServicio }      from './application/services/ActivarUsuarioServicio';
import { PrismaUsuarioRepositorio }    from './infrastructure/persistence/PrismaUsuarioRepositorio';

@Module({
    controllers: [UsuariosControlador],
    providers: [
        AdminGuard,
        ObtenerUsuariosServicio,
        ObtenerUsuarioPorDniServicio,
        CrearUsuarioServicio,
        ActualizarUsuarioServicio,
        DarDeBajaUsuarioServicio,
        ActivarUsuarioServicio,
        {
            provide:  'IRepositorioUsuario',
            useClass: PrismaUsuarioRepositorio,
        },
    ],
    exports: ['IRepositorioUsuario'],
})
export class UsuariosModule { }
