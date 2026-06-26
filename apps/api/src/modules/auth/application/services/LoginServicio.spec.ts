import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { LoginServicio } from './LoginServicio';
import { IRepositorioUsuario } from '../../../usuarios/domain/repositories/IRepositorioUsuario';
import { Usuario } from '../../../usuarios/domain/entities/Usuario';
import { Rol } from '../../../usuarios/domain/entities/Rol';

function crearMockUsuarioRepo(): jest.Mocked<IRepositorioUsuario> {
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

function crearUsuario(estado: string = 'activo'): Usuario {
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

describe('LoginServicio', () => {
  let servicio: LoginServicio;
  let repositorio: jest.Mocked<IRepositorioUsuario>;

  beforeEach(() => {
    repositorio = crearMockUsuarioRepo();
    servicio = new LoginServicio(repositorio);
  });

  it('lanza UnauthorizedException cuando el usuario no existe', async () => {
    repositorio.buscarPorDni.mockResolvedValue(null);

    await expect(
      servicio.ejecutar({ dni: '99999999', clave: 'password123' }),
    ).rejects.toThrow(UnauthorizedException);

    expect(repositorio.buscarPorDni).toHaveBeenCalledWith('99999999');
  });

  it('lanza UnauthorizedException cuando la contraseña es incorrecta', async () => {
    const usuario = crearUsuario();
    repositorio.buscarPorDni.mockResolvedValue(usuario);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

    await expect(
      servicio.ejecutar({ dni: '12345678', clave: 'wrong_password' }),
    ).rejects.toThrow(
      new UnauthorizedException('DNI o contraseña incorrectos.'),
    );
  });

  it('lanza UnauthorizedException cuando la cuenta está desactivada', async () => {
    const usuarioInactivo = crearUsuario('inactivo');
    repositorio.buscarPorDni.mockResolvedValue(usuarioInactivo);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

    await expect(
      servicio.ejecutar({ dni: '12345678', clave: 'password123' }),
    ).rejects.toThrow(
      new UnauthorizedException(
        'Tu cuenta está desactivada. Contactá con el administrador.',
      ),
    );
  });

  it('retorna el DTO del usuario cuando las credenciales son válidas', async () => {
    const usuario = crearUsuario('activo');
    repositorio.buscarPorDni.mockResolvedValue(usuario);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

    const resultado = await servicio.ejecutar({
      dni: '12345678',
      clave: 'password123',
    });

    expect(resultado).toBeDefined();
    expect(resultado.dni).toBe('12345678');
    expect(resultado.nombre).toBe('Juan');
    expect(resultado.apellido).toBe('Perez');
  });
});
