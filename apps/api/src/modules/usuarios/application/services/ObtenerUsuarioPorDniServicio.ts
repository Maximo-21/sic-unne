import { Injectable, Inject } from '@nestjs/common';
import { IRepositorioUsuario } from '../../domain/repositories/IRepositorioUsuario';
import { Usuario } from '../../domain/entities/Usuario';

@Injectable()
export class ObtenerUsuarioPorDniServicio {
    constructor(
        @Inject('IRepositorioUsuario')
        private readonly repositorio: IRepositorioUsuario
    ) { }

    async ejecutar(dni: string): Promise<Usuario | null> {
        return this.repositorio.buscarPorDni(dni);
    }
}
