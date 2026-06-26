import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { MatchingControlador }                    from './MatchingControlador';
import { CrearSolicitudServicio }                 from '../../application/services/CrearSolicitudServicio';
import { VotarPropuestaServicio }                 from '../../application/services/VotarPropuestaServicio';
import { CancelarSolicitudServicio }              from '../../application/services/CancelarSolicitudServicio';
import { ObtenerSolicitudesEstudianteServicio }   from '../../application/services/ObtenerSolicitudesEstudianteServicio';
import { ObtenerPropuestasEstudianteServicio }    from '../../application/services/ObtenerPropuestasEstudianteServicio';
import { ObtenerPropuestasAdminServicio }         from '../../application/services/ObtenerPropuestasAdminServicio';
import { EstudianteGuard }                        from '../../../auth/infrastructure/guards/EstudianteGuard';
import { AdminGuard }                             from '../../../auth/infrastructure/guards/AdminGuard';

const mockCrearSolicitudServicio              = { ejecutar: jest.fn() };
const mockVotarPropuestaServicio              = { ejecutar: jest.fn() };
const mockCancelarSolicitudServicio           = { ejecutar: jest.fn() };
const mockObtenerSolicitudesEstudianteServicio = { ejecutar: jest.fn() };
const mockObtenerPropuestasEstudianteServicio  = { ejecutar: jest.fn() };
const mockObtenerPropuestasAdminServicio       = { ejecutar: jest.fn() };

const solicitudDto = {
    id: 1,
    estado: 'pendiente',
    fechaCreacion: new Date().toISOString(),
    idUsuario: 'usr_001',
    idComisionOrigen: 101,
    idComisionDestino: 102,
};

const propuestaDto = {
    id: 1,
    estadoGeneral: 'pendiente',
    estadoAlumno1: 'pendiente',
    estadoAlumno2: 'pendiente',
    fechaMatch: null,
    idSolicitud1: 1,
    idSolicitud2: 2,
};

describe('MatchingControlador (integración)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [MatchingControlador],
            providers: [
                { provide: CrearSolicitudServicio,               useValue: mockCrearSolicitudServicio },
                { provide: VotarPropuestaServicio,               useValue: mockVotarPropuestaServicio },
                { provide: CancelarSolicitudServicio,            useValue: mockCancelarSolicitudServicio },
                { provide: ObtenerSolicitudesEstudianteServicio, useValue: mockObtenerSolicitudesEstudianteServicio },
                { provide: ObtenerPropuestasEstudianteServicio,  useValue: mockObtenerPropuestasEstudianteServicio },
                { provide: ObtenerPropuestasAdminServicio,       useValue: mockObtenerPropuestasAdminServicio },
            ],
        })
            .overrideGuard(EstudianteGuard).useValue({ canActivate: () => true })
            .overrideGuard(AdminGuard).useValue({ canActivate: () => true })
            .compile();

        app = module.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
        await app.init();
    });

    afterEach(async () => {
        jest.clearAllMocks();
        await app.close();
    });

    describe('GET /matching/solicitudes/me', () => {
        it('retorna 200 con las solicitudes del estudiante', async () => {
            mockObtenerSolicitudesEstudianteServicio.ejecutar.mockResolvedValue([solicitudDto]);

            const response = await request(app.getHttpServer())
                .get('/matching/solicitudes/me')
                .set('x-user-id', 'usr_001')
                .expect(200);

            expect(response.body.status).toBe('OK');
            expect(response.body.cantidad).toBe(1);
        });

        it('retorna 400 cuando falta el header x-user-id', async () => {
            await request(app.getHttpServer())
                .get('/matching/solicitudes/me')
                .expect(400);
        });
    });

    describe('GET /matching/propuestas/me', () => {
        it('retorna 200 con las propuestas del estudiante', async () => {
            mockObtenerPropuestasEstudianteServicio.ejecutar.mockResolvedValue([propuestaDto]);

            const response = await request(app.getHttpServer())
                .get('/matching/propuestas/me')
                .set('x-user-id', 'usr_001')
                .expect(200);

            expect(response.body.status).toBe('OK');
            expect(response.body.cantidad).toBe(1);
        });
    });

    describe('GET /matching/propuestas', () => {
        it('retorna 200 con todas las propuestas para admin', async () => {
            mockObtenerPropuestasAdminServicio.ejecutar.mockResolvedValue([propuestaDto]);

            const response = await request(app.getHttpServer())
                .get('/matching/propuestas')
                .expect(200);

            expect(response.body.status).toBe('OK');
            expect(response.body.cantidad).toBe(1);
        });
    });

    describe('POST /matching/solicitudes', () => {
        it('retorna 201 cuando la solicitud es creada', async () => {
            mockCrearSolicitudServicio.ejecutar.mockResolvedValue({
                solicitud: solicitudDto,
                propuesta: null,
            });

            const response = await request(app.getHttpServer())
                .post('/matching/solicitudes')
                .set('x-user-id', 'usr_001')
                .send({ idComisionOrigen: 101, idComisionDestino: 102 })
                .expect(201);

            expect(response.body.status).toBe('OK');
            expect(response.body.data.propuesta).toBeNull();
        });

        it('retorna 400 cuando el body no tiene los campos requeridos', async () => {
            await request(app.getHttpServer())
                .post('/matching/solicitudes')
                .set('x-user-id', 'usr_001')
                .send({})
                .expect(400);
        });

        it('retorna 201 con propuesta cuando se detecta un match', async () => {
            mockCrearSolicitudServicio.ejecutar.mockResolvedValue({
                solicitud: solicitudDto,
                propuesta: propuestaDto,
            });

            const response = await request(app.getHttpServer())
                .post('/matching/solicitudes')
                .set('x-user-id', 'usr_001')
                .send({ idComisionOrigen: 101, idComisionDestino: 102 })
                .expect(201);

            expect(response.body.data.propuesta).not.toBeNull();
        });
    });

    describe('PATCH /matching/propuestas/:id/votar', () => {
        it('retorna 200 cuando el voto es registrado', async () => {
            mockVotarPropuestaServicio.ejecutar.mockResolvedValue(propuestaDto);

            const response = await request(app.getHttpServer())
                .patch('/matching/propuestas/1/votar')
                .set('x-user-id', 'usr_001')
                .send({ voto: 'aceptado' })
                .expect(200);

            expect(response.body.status).toBe('OK');
        });

        it('retorna 400 cuando el voto no es válido', async () => {
            await request(app.getHttpServer())
                .patch('/matching/propuestas/1/votar')
                .set('x-user-id', 'usr_001')
                .send({ voto: 'invalido' })
                .expect(400);
        });

        it('retorna 400 cuando el id de propuesta no es un número', async () => {
            await request(app.getHttpServer())
                .patch('/matching/propuestas/abc/votar')
                .set('x-user-id', 'usr_001')
                .send({ voto: 'aceptado' })
                .expect(400);
        });
    });

    describe('DELETE /matching/solicitudes/:id', () => {
        it('retorna 200 cuando la solicitud es cancelada', async () => {
            mockCancelarSolicitudServicio.ejecutar.mockResolvedValue(undefined);

            const response = await request(app.getHttpServer())
                .delete('/matching/solicitudes/1')
                .set('x-user-id', 'usr_001')
                .expect(200);

            expect(response.body.status).toBe('OK');
            expect(mockCancelarSolicitudServicio.ejecutar).toHaveBeenCalledWith(1, 'usr_001');
        });

        it('retorna 400 cuando el id de solicitud no es un número', async () => {
            await request(app.getHttpServer())
                .delete('/matching/solicitudes/abc')
                .set('x-user-id', 'usr_001')
                .expect(400);
        });

        it('retorna 404 cuando la solicitud no existe', async () => {
            const { NotFoundException } = await import('@nestjs/common');
            mockCancelarSolicitudServicio.ejecutar.mockRejectedValue(
                new NotFoundException('Solicitud 999 no encontrada.'),
            );

            await request(app.getHttpServer())
                .delete('/matching/solicitudes/999')
                .set('x-user-id', 'usr_001')
                .expect(404);
        });
    });
});
