import { NotFoundException } from '@nestjs/common';
import { ActivarUsuarioServicio } from './ActivarUsuarioServicio';
import { IRepositorioUsuario } from '../../domain/repositories/IRepositorioUsuario';
import { Usuario } from '../../domain/entities/Usuario';
import { Rol } from '../../domain/entities/Rol';

function crearMockRepo(): jest.Mocked<IRepositorioUsuario> {
    return {
        obtenerTodos: jest.fn(),
        buscarPorId: jest.fn(),
        buscarPorDni: jest.fn(),
        guardar: jest.fn(),
        actualizar: jest.fn(),
        darDeBaja: jest.fn(),
        activar: jest.fn(),
    };
}

function crearUsuario(estado = 'inactivo'): Usuario {
    return new Usuario(
        'usr_001', '12345678', 'Juan', 'Perez', 'juan@email.com',
        'hashed_password', null, 1, new Rol(1, 'estudiante'), estado, new Date(),
    );
}

describe('ActivarUsuarioServicio', () => {
    let servicio: ActivarUsuarioServicio;
    let repositorio: jest.Mocked<IRepositorioUsuario>;

    beforeEach(() => {
        repositorio = crearMockRepo();
        servicio = new ActivarUsuarioServicio(repositorio);
    });

    it('lanza NotFoundException cuando el usuario no existe', async () => {
        repositorio.buscarPorId.mockResolvedValue(null);

        await expect(servicio.ejecutar('usr_inexistente')).rejects.toThrow(
            new NotFoundException('No se encontró el usuario con ID: usr_inexistente'),
        );

        expect(repositorio.activar).not.toHaveBeenCalled();
    });

    it('invoca activar cuando el usuario existe', async () => {
        repositorio.buscarPorId.mockResolvedValue(crearUsuario('inactivo'));
        repositorio.activar.mockResolvedValue(undefined);

        await servicio.ejecutar('usr_001');

        expect(repositorio.activar).toHaveBeenCalledWith('usr_001');
    });
});
