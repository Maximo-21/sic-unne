import { NotFoundException, BadRequestException } from '@nestjs/common';
import { DarDeBajaUsuarioServicio } from './DarDeBajaUsuarioServicio';
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

function crearUsuario(estado = 'activo'): Usuario {
    return new Usuario(
        'usr_001', '12345678', 'Juan', 'Perez', 'juan@email.com',
        'hashed_password', null, 1, new Rol(1, 'estudiante'), estado, new Date(),
    );
}

describe('DarDeBajaUsuarioServicio', () => {
    let servicio: DarDeBajaUsuarioServicio;
    let repositorio: jest.Mocked<IRepositorioUsuario>;

    beforeEach(() => {
        repositorio = crearMockRepo();
        servicio = new DarDeBajaUsuarioServicio(repositorio);
    });

    it('lanza BadRequestException cuando el usuario ya se encuentra inactivo', async () => {
        repositorio.buscarPorId.mockResolvedValue(crearUsuario('inactivo'));

        await expect(servicio.ejecutar('usr_001')).rejects.toThrow(
            new BadRequestException('El usuario ya se encuentra inactivo.'),
        );

        expect(repositorio.darDeBaja).not.toHaveBeenCalled();
    });

    it('lanza NotFoundException cuando el usuario no existe', async () => {
        repositorio.buscarPorId.mockResolvedValue(null);

        await expect(servicio.ejecutar('usr_inexistente')).rejects.toThrow(
            new NotFoundException('No se encontró el usuario con ID: usr_inexistente'),
        );

        expect(repositorio.darDeBaja).not.toHaveBeenCalled();
    });

    it('invoca darDeBaja cuando el usuario existe', async () => {
        repositorio.buscarPorId.mockResolvedValue(crearUsuario());
        repositorio.darDeBaja.mockResolvedValue(undefined);

        await servicio.ejecutar('usr_001');

        expect(repositorio.darDeBaja).toHaveBeenCalledWith('usr_001');
    });
});
