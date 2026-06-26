import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { UsuariosControlador } from './UsuariosControlador';
import { ObtenerUsuariosServicio }      from '../../application/services/ObtenerUsuariosServicio';
import { ObtenerUsuarioPorDniServicio } from '../../application/services/ObtenerUsuarioPorDniServicio';
import { CrearUsuarioServicio }         from '../../application/services/CrearUsuarioServicio';
import { ActualizarUsuarioServicio }    from '../../application/services/ActualizarUsuarioServicio';
import { DarDeBajaUsuarioServicio }     from '../../application/services/DarDeBajaUsuarioServicio';
import { ActivarUsuarioServicio }       from '../../application/services/ActivarUsuarioServicio';
import { AdminGuard }                   from '../../../auth/infrastructure/guards/AdminGuard';

const mockObtenerUsuariosServicio      = { ejecutar: jest.fn() };
const mockObtenerUsuarioPorDniServicio = { ejecutar: jest.fn() };
const mockCrearUsuarioServicio         = { ejecutar: jest.fn() };
const mockActualizarUsuarioServicio    = { ejecutar: jest.fn() };
const mockDarDeBajaUsuarioServicio     = { ejecutar: jest.fn() };
const mockActivarUsuarioServicio       = { ejecutar: jest.fn() };

const usuarioDto = {
    id_usuario: 'usr_001',
    dni: '12345678',
    nombre: 'Juan',
    apellido: 'Perez',
    email: 'juan@email.com',
    carrera: null,
    rol_descripcion: 'estudiante',
    estado: 'activo',
    fecha_registro: new Date().toISOString(),
};

// Mock de Usuario para los servicios que retornan entidad (no DTO)
const usuarioEntidad = {
    id: 'usr_001', dni: '12345678', nombre: 'Juan', apellido: 'Perez',
    email: 'juan@email.com', contraseña: 'hashed', carrera: null,
    idRol: 1, rol: { id: 1, descripcion: 'estudiante', esEstudiante: () => true, esAdministrador: () => false },
    estado: 'activo', fechaRegistro: new Date(),
    obtenerNombreCompleto: () => 'Juan Perez',
    esEstudiante: () => true,
    esAdministrador: () => false,
};

describe('UsuariosControlador (integración)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsuariosControlador],
            providers: [
                { provide: ObtenerUsuariosServicio,      useValue: mockObtenerUsuariosServicio },
                { provide: ObtenerUsuarioPorDniServicio, useValue: mockObtenerUsuarioPorDniServicio },
                { provide: CrearUsuarioServicio,         useValue: mockCrearUsuarioServicio },
                { provide: ActualizarUsuarioServicio,    useValue: mockActualizarUsuarioServicio },
                { provide: DarDeBajaUsuarioServicio,     useValue: mockDarDeBajaUsuarioServicio },
                { provide: ActivarUsuarioServicio,       useValue: mockActivarUsuarioServicio },
            ],
        })
            .overrideGuard(AdminGuard)
            .useValue({ canActivate: () => true })
            .compile();

        app = module.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
        await app.init();
    });

    afterEach(async () => {
        jest.clearAllMocks();
        await app.close();
    });

    describe('GET /usuarios', () => {
        it('retorna 200 con la lista de usuarios', async () => {
            mockObtenerUsuariosServicio.ejecutar.mockResolvedValue([usuarioEntidad]);

            const response = await request(app.getHttpServer())
                .get('/usuarios')
                .expect(200);

            expect(response.body.status).toBe('OK');
            expect(response.body.cantidad).toBe(1);
            expect(response.body.data).toHaveLength(1);
        });

        it('retorna 200 con lista vacía cuando no hay usuarios', async () => {
            mockObtenerUsuariosServicio.ejecutar.mockResolvedValue([]);

            const response = await request(app.getHttpServer())
                .get('/usuarios')
                .expect(200);

            expect(response.body.cantidad).toBe(0);
            expect(response.body.data).toHaveLength(0);
        });
    });

    describe('GET /usuarios/:dni', () => {
        it('retorna 200 con el usuario cuando existe', async () => {
            mockObtenerUsuarioPorDniServicio.ejecutar.mockResolvedValue(usuarioEntidad);

            const response = await request(app.getHttpServer())
                .get('/usuarios/12345678')
                .expect(200);

            expect(response.body.status).toBe('OK');
            expect(response.body.data.dni).toBe('12345678');
        });

        it('retorna 404 cuando el usuario no existe', async () => {
            mockObtenerUsuarioPorDniServicio.ejecutar.mockResolvedValue(null);

            await request(app.getHttpServer())
                .get('/usuarios/99999999')
                .expect(404);
        });
    });

    describe('POST /usuarios', () => {
        it('retorna 201 cuando el usuario es creado correctamente', async () => {
            mockCrearUsuarioServicio.ejecutar.mockResolvedValue(usuarioDto);

            const response = await request(app.getHttpServer())
                .post('/usuarios')
                .send({
                    dni: '12345678',
                    nombre: 'Juan',
                    apellido: 'Perez',
                    email: 'juan@email.com',
                    contrasena: 'password123',
                    idRol: 1,
                })
                .expect(201);

            expect(response.body.status).toBe('OK');
            expect(response.body.data.dni).toBe('12345678');
        });

        it('retorna 400 cuando faltan campos obligatorios', async () => {
            await request(app.getHttpServer())
                .post('/usuarios')
                .send({ dni: '12345678' })
                .expect(400);

            expect(mockCrearUsuarioServicio.ejecutar).not.toHaveBeenCalled();
        });

        it('retorna 400 cuando el email es inválido', async () => {
            await request(app.getHttpServer())
                .post('/usuarios')
                .send({
                    dni: '12345678',
                    nombre: 'Juan',
                    apellido: 'Perez',
                    email: 'email_invalido',
                    contrasena: 'password123',
                    idRol: 1,
                })
                .expect(400);
        });
    });

    describe('PATCH /usuarios/:id/desactivar', () => {
        it('retorna 200 cuando el usuario es desactivado', async () => {
            mockDarDeBajaUsuarioServicio.ejecutar.mockResolvedValue(undefined);

            const response = await request(app.getHttpServer())
                .patch('/usuarios/usr_001/desactivar')
                .expect(200);

            expect(response.body.status).toBe('OK');
            expect(mockDarDeBajaUsuarioServicio.ejecutar).toHaveBeenCalledWith('usr_001');
        });

        it('retorna 404 cuando el usuario no existe', async () => {
            const { NotFoundException } = await import('@nestjs/common');
            mockDarDeBajaUsuarioServicio.ejecutar.mockRejectedValue(
                new NotFoundException('No se encontró el usuario con ID: usr_999'),
            );

            await request(app.getHttpServer())
                .patch('/usuarios/usr_999/desactivar')
                .expect(404);
        });
    });

    describe('PATCH /usuarios/:id/activar', () => {
        it('retorna 200 cuando el usuario es activado', async () => {
            mockActivarUsuarioServicio.ejecutar.mockResolvedValue(undefined);

            const response = await request(app.getHttpServer())
                .patch('/usuarios/usr_001/activar')
                .expect(200);

            expect(response.body.status).toBe('OK');
            expect(mockActivarUsuarioServicio.ejecutar).toHaveBeenCalledWith('usr_001');
        });
    });
});
