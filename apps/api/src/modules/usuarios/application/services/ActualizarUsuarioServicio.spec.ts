import { NotFoundException, BadRequestException } from '@nestjs/common';
import { ActualizarUsuarioServicio } from './ActualizarUsuarioServicio';
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
        'usr_001',
        '12345678',
        'Juan',
        'Perez',
        'juan@email.com',
        'hashed_password',
        null,
        1,
        new Rol(1, 'estudiante'),
        estado,
        new Date(),
    );
}

describe('ActualizarUsuarioServicio', () => {
    let servicio: ActualizarUsuarioServicio;
    let repositorio: jest.Mocked<IRepositorioUsuario>;

    beforeEach(() => {
        repositorio = crearMockRepo();
        servicio = new ActualizarUsuarioServicio(repositorio);
    });

    it('lanza BadRequestException cuando el usuario existe pero está inactivo', async () => {
        repositorio.buscarPorId.mockResolvedValue(crearUsuario('inactivo'));

        await expect(
            servicio.ejecutar('usr_001', { nombre: 'Nuevo' }),
        ).rejects.toThrow(new BadRequestException('No se puede modificar un usuario inactivo.'));

        expect(repositorio.actualizar).not.toHaveBeenCalled();
    });

    it('lanza NotFoundException cuando el usuario no existe', async () => {
        repositorio.buscarPorId.mockResolvedValue(null);

        await expect(
            servicio.ejecutar('usr_inexistente', { nombre: 'Nuevo' }),
        ).rejects.toThrow(new NotFoundException('No se encontró el usuario con ID: usr_inexistente'));

        expect(repositorio.actualizar).not.toHaveBeenCalled();
    });

    it('actualiza y retorna el DTO cuando el usuario existe', async () => {
        const usuarioActualizado = new Usuario(
            'usr_001', '12345678', 'Carlos', 'Perez', 'juan@email.com',
            'hashed_password', null, 1, new Rol(1, 'estudiante'), 'activo', new Date(),
        );
        repositorio.buscarPorId.mockResolvedValue(crearUsuario());
        repositorio.actualizar.mockResolvedValue(usuarioActualizado);

        const resultado = await servicio.ejecutar('usr_001', { nombre: 'Carlos' });

        expect(repositorio.actualizar).toHaveBeenCalledWith('usr_001', { nombre: 'Carlos' });
        expect(resultado.nombre).toBe('Carlos');
    });
});
