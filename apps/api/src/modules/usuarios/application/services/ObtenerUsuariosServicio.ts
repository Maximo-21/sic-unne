import { Injectable, Inject } from '@nestjs/common';
import { IRepositorioUsuario } from '../../domain/repositories/IRepositorioUsuario';
import { Usuario } from '../../domain/entities/Usuario';

@Injectable()
export class ObtenerUsuariosServicio {
    constructor(
        @Inject('IRepositorioUsuario')
        private readonly repositorio: IRepositorioUsuario
    ) { }

    async ejecutar(): Promise<Usuario[]> {
        return this.repositorio.obtenerTodos();
    }
}
