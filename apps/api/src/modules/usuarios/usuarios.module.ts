import { Module } from '@nestjs/common';
import { UsuariosControlador } from './infrastructure/controllers/UsuariosControlador';
import { ObtenerUsuariosServicio } from './application/services/ObtenerUsuariosServicio';
import { ObtenerUsuarioPorDniServicio } from './application/services/ObtenerUsuarioPorDniServicio';
import { PrismaUsuarioRepositorio } from './infrastructure/persistence/PrismaUsuarioRepositorio';

@Module({
    controllers: [UsuariosControlador],
    providers: [
        ObtenerUsuariosServicio,
        ObtenerUsuarioPorDniServicio,
        {
            // "Inyectamos" la interfaz pero usamos la implementación de Prisma
            provide: 'UsuarioRepositorio',
            useClass: PrismaUsuarioRepositorio,
        },
    ],
})
export class UsuariosModule { }