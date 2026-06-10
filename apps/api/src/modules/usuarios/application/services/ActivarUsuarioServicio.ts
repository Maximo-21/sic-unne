import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IRepositorioUsuario } from '../../domain/repositories/IRepositorioUsuario';

@Injectable()
export class ActivarUsuarioServicio {
    constructor(
        @Inject('IRepositorioUsuario')
        private readonly repositorio: IRepositorioUsuario
    ) { }

    async ejecutar(id_usuario: string): Promise<void> {
        const usuario = await this.repositorio.buscarPorId(id_usuario);
        if (!usuario) {
            throw new NotFoundException(`No se encontró el usuario con ID: ${id_usuario}`);
        }
        await this.repositorio.activar(id_usuario);
    }
}
