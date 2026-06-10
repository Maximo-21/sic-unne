import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/prisma.service';

@Injectable()
export class AutenticadoGuard implements CanActivate {
    constructor(private readonly prisma: PrismaService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request & { headers: Record<string, string> }>();
        const idUsuario = request.headers['x-user-id'];

        if (!idUsuario) throw new UnauthorizedException('Header x-user-id requerido.');

        try {
            const usuario = await this.prisma.usuario.findUnique({
                where: { id_usuario: idUsuario },
            });

            if (!usuario || usuario.estado !== 'activo') {
                throw new UnauthorizedException('Usuario no encontrado o inactivo.');
            }

            return true;
        } catch (err) {
            if (err instanceof UnauthorizedException) throw err;
            throw new UnauthorizedException('Acceso no autorizado.');
        }
    }
}
