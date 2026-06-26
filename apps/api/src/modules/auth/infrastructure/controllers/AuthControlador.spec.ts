import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AuthControlador } from './AuthControlador';
import { LoginServicio } from '../../application/services/LoginServicio';

const mockLoginServicio = {
    ejecutar: jest.fn(),
};

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

describe('AuthControlador (integración)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthControlador],
            providers: [
                { provide: LoginServicio, useValue: mockLoginServicio },
            ],
        }).compile();

        app = module.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
        await app.init();
    });

    afterEach(async () => {
        jest.clearAllMocks();
        await app.close();
    });

    describe('POST /auth/login', () => {
        it('retorna 200 con el usuario cuando las credenciales son correctas', async () => {
            mockLoginServicio.ejecutar.mockResolvedValue(usuarioDto);

            const response = await request(app.getHttpServer())
                .post('/auth/login')
                .send({ dni: '12345678', clave: 'password123' })
                .expect(200);

            expect(response.body.status).toBe('OK');
            expect(response.body.data.dni).toBe('12345678');
            expect(mockLoginServicio.ejecutar).toHaveBeenCalledWith({
                dni: '12345678',
                clave: 'password123',
            });
        });

        it('retorna 400 cuando el body está vacío', async () => {
            await request(app.getHttpServer())
                .post('/auth/login')
                .send({})
                .expect(400);

            expect(mockLoginServicio.ejecutar).not.toHaveBeenCalled();
        });

        it('retorna 400 cuando falta el campo clave', async () => {
            await request(app.getHttpServer())
                .post('/auth/login')
                .send({ dni: '12345678' })
                .expect(400);
        });

        it('retorna 401 cuando el servicio lanza UnauthorizedException', async () => {
            const { UnauthorizedException } = await import('@nestjs/common');
            mockLoginServicio.ejecutar.mockRejectedValue(
                new UnauthorizedException('DNI o contraseña incorrectos.'),
            );

            await request(app.getHttpServer())
                .post('/auth/login')
                .send({ dni: '99999999', clave: 'wrong' })
                .expect(401);
        });
    });
});
