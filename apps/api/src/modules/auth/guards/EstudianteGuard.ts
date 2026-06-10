import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../../shared/infrastructure/prisma.service';

@Injectable()
export class EstudianteGuard implements CanActivate {
    constructor(private readonly prisma: PrismaService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request & { headers: Record<string, string> }>();
        const idUsuario = request.headers['x-user-id'];

        if (!idUsuario) throw new UnauthorizedException('Header x-user-id requerido.');

        try {
            const usuario = await this.prisma.usuario.findUnique({
                where:   { id_usuario: idUsuario },
                include: { rol: true },
            });

            if (!usuario || usuario.estado !== 'activo') {
                throw new UnauthorizedException('Usuario no encontrado o inactivo.');
            }

            if (usuario.rol.descripcion !== 'estudiante') {
                throw new ForbiddenException('Acceso denegado: se requiere rol estudiante.');
            }

            return true;
        } catch (err) {
            if (err instanceof UnauthorizedException || err instanceof ForbiddenException) throw err;
            throw new UnauthorizedException('Acceso no autorizado.');
        }
    }
}
