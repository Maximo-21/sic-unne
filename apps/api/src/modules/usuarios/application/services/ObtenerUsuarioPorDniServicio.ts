import { Injectable, Inject } from '@nestjs/common';
import { UsuarioRepositorio } from '../../domain/repositories/UsuarioRepositorio';

@Injectable()
export class ObtenerUsuarioPorDniServicio {
    constructor(
        @Inject('UsuarioRepositorio')
        private readonly repositorio: UsuarioRepositorio
    ) { }

    async ejecutar(dni: string) {
        const usuario = await this.repositorio.buscarPorDni(dni);

        // Podés devolver el usuario directamente o lanzar un error si no existe
        return usuario;
    }
}