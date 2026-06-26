import { ConflictException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CrearUsuarioServicio } from './CrearUsuarioServicio';
import { IRepositorioUsuario } from '../../domain/repositories/IRepositorioUsuario';
import { Usuario } from '../../domain/entities/Usuario';
import { Rol } from '../../domain/entities/Rol';
import { CrearUsuarioDto } from '../dto/CrearUsuarioDto';

// ─── Plan de Prueba 1: Registrar Usuario ─────────────────────────────────────

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

function crearUsuarioGuardado(): Usuario {
    return new Usuario(
        'usr_generated',
        '12345678',
        'Juan',
        'Perez',
        'juan@email.com',
        'hashed_password',
        'Ingeniería',
        1,
        new Rol(1, 'estudiante'),
        'activo',
        new Date(),
    );
}

describe('CrearUsuarioServicio', () => {
    let servicio: CrearUsuarioServicio;
    let repositorio: jest.Mocked<IRepositorioUsuario>;

    beforeEach(() => {
        repositorio = crearMockRepo();
        servicio = new CrearUsuarioServicio(repositorio);
    });

    // ── CP1: Curso Normal — registro exitoso ─────────────────────────────────
    it('CP1 — registra exitosamente un nuevo alumno con datos válidos y únicos', async () => {
        repositorio.buscarPorDni.mockResolvedValue(null);
        repositorio.guardar.mockResolvedValue(crearUsuarioGuardado());

        const resultado = await servicio.ejecutar({
            dni: '12345678',
            nombre: 'Juan',
            apellido: 'Perez',
            email: 'juan@email.com',
            contrasena: 'password123',
            idRol: 1,
        });

        expect(repositorio.guardar).toHaveBeenCalledTimes(1);
        expect(resultado.dni).toBe('12345678');
        expect(resultado.nombre).toBe('Juan');
        expect(resultado.estado).toBe('activo');
    });

    // ── CP2: DNI duplicado — conflicto de unicidad ───────────────────────────
    it('CP2 — lanza ConflictException cuando el DNI ya está registrado en el sistema', async () => {
        repositorio.buscarPorDni.mockResolvedValue(crearUsuarioGuardado());

        await expect(
            servicio.ejecutar({
                dni: '12345678',
                nombre: 'Juan',
                apellido: 'Perez',
                email: 'juan@email.com',
                contrasena: 'password123',
                idRol: 1,
            }),
        ).rejects.toThrow(new ConflictException('El usuario con DNI 12345678 ya existe.'));

        expect(repositorio.guardar).not.toHaveBeenCalled();
    });

    // ── CP3: Campos obligatorios vacíos — validación de DTO ─────────────────
    it('CP3 — rechaza el DTO cuando los campos obligatorios están vacíos', async () => {
        const dtoInvalido = plainToInstance(CrearUsuarioDto, {
            dni: '',
            nombre: '',
            apellido: '',
            email: 'no-es-email',
            contrasena: '123',
            idRol: 'no-es-numero',
        });

        const errores = await validate(dtoInvalido);

        expect(errores.length).toBeGreaterThan(0);
        const propiedadesConError = errores.map(e => e.property);
        expect(propiedadesConError).toContain('dni');
        expect(propiedadesConError).toContain('nombre');
        expect(propiedadesConError).toContain('apellido');
        expect(propiedadesConError).toContain('email');
        expect(propiedadesConError).toContain('contrasena');
    });

    it('hashea la contraseña antes de guardar', async () => {
        repositorio.buscarPorDni.mockResolvedValue(null);
        repositorio.guardar.mockResolvedValue(crearUsuarioGuardado());

        await servicio.ejecutar({
            dni: '12345678',
            nombre: 'Juan',
            apellido: 'Perez',
            email: 'juan@email.com',
            contrasena: 'password123',
            idRol: 1,
        });

        const usuarioGuardado = repositorio.guardar.mock.calls[0][0] as Usuario;
        expect(usuarioGuardado.contraseña).not.toBe('password123');
        expect(usuarioGuardado.contraseña).toMatch(/^\$2[ab]\$/);
    });
});
