import { Injectable, Inject } from '@nestjs/common';
import { UsuarioRepositorio } from '../../domain/repositories/UsuarioRepositorio';

@Injectable()
export class ObtenerUsuariosServicio {
    constructor(
        @Inject('UsuarioRepositorio')
        private readonly repositorio: UsuarioRepositorio
    ) { }

    async ejecutar() {
        // Aquí podrías agregar lógica extra, como filtrar solo los activos
        return await this.repositorio.obtenerTodos();
    }
}