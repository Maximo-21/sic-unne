import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { GestionAcademicaControlador }               from './GestionAcademicaControlador';
import { CrearInscripcionServicio }                  from '../../application/services/CrearInscripcionServicio';
import { ObtenerInscripcionesEstudianteServicio }    from '../../application/services/ObtenerInscripcionesEstudianteServicio';
import { ObtenerInscripcionesAdminServicio }         from '../../application/services/ObtenerInscripcionesAdminServicio';
import { ObtenerComisionesServicio }                 from '../../application/services/ObtenerComisionesServicio';
import { ObtenerAsignaturasServicio }                from '../../application/services/ObtenerAsignaturasServicio';
import { ObtenerHorariosServicio }                   from '../../application/services/ObtenerHorariosServicio';
import { AdminGuard }                                from '../../../auth/infrastructure/guards/AdminGuard';
import { EstudianteGuard }                           from '../../../auth/infrastructure/guards/EstudianteGuard';
import { AutenticadoGuard }                          from '../../../auth/infrastructure/guards/AutenticadoGuard';

const mockCrearInscripcionServicio              = { ejecutar: jest.fn() };
const mockObtenerInscripcionesEstudianteServicio = { ejecutar: jest.fn() };
const mockObtenerInscripcionesAdminServicio     = { ejecutar: jest.fn() };
const mockObtenerComisionesServicio             = { ejecutar: jest.fn() };
const mockObtenerAsignaturasServicio            = { ejecutar: jest.fn() };
const mockObtenerHorariosServicio               = { ejecutar: jest.fn() };

const inscripcionDto = {
    id_inscripcion: 1,
    estado: 'activa',
    fecha_inscripcion: new Date().toISOString(),
    id_comision: 10,
    id_usuario: 'usr_001',
    nombre_comision: 'Comision A',
    nombre_asignatura: 'Matemáticas',
};

describe('GestionAcademicaControlador (integración)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [GestionAcademicaControlador],
            providers: [
                { provide: CrearInscripcionServicio,               useValue: mockCrearInscripcionServicio },
                { provide: ObtenerInscripcionesEstudianteServicio, useValue: mockObtenerInscripcionesEstudianteServicio },
                { provide: ObtenerInscripcionesAdminServicio,      useValue: mockObtenerInscripcionesAdminServicio },
                { provide: ObtenerComisionesServicio,              useValue: mockObtenerComisionesServicio },
                { provide: ObtenerAsignaturasServicio,             useValue: mockObtenerAsignaturasServicio },
                { provide: ObtenerHorariosServicio,                useValue: mockObtenerHorariosServicio },
            ],
        })
            .overrideGuard(EstudianteGuard).useValue({ canActivate: () => true })
            .overrideGuard(AdminGuard).useValue({ canActivate: () => true })
            .overrideGuard(AutenticadoGuard).useValue({ canActivate: () => true })
            .compile();

        app = module.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
        await app.init();
    });

    afterEach(async () => {
        jest.clearAllMocks();
        await app.close();
    });

    describe('POST /academico/inscripciones', () => {
        it('retorna 201 cuando la inscripción es creada', async () => {
            mockCrearInscripcionServicio.ejecutar.mockResolvedValue(inscripcionDto);

            const response = await request(app.getHttpServer())
                .post('/academico/inscripciones')
                .set('x-user-id', 'usr_001')
                .send({ idComision: 10 })
                .expect(201);

            expect(response.body.status).toBe('OK');
            expect(response.body.data.id_comision).toBe(10);
        });

        it('retorna 400 cuando falta el header x-user-id', async () => {
            await request(app.getHttpServer())
                .post('/academico/inscripciones')
                .send({ id_comision: 10 })
                .expect(400);
        });

        it('retorna 400 cuando el body no tiene id_comision', async () => {
            await request(app.getHttpServer())
                .post('/academico/inscripciones')
                .set('x-user-id', 'usr_001')
                .send({})
                .expect(400);
        });
    });

    describe('GET /academico/inscripciones/me', () => {
        it('retorna 200 con las inscripciones del estudiante', async () => {
            mockObtenerInscripcionesEstudianteServicio.ejecutar.mockResolvedValue([inscripcionDto]);

            const response = await request(app.getHttpServer())
                .get('/academico/inscripciones/me')
                .set('x-user-id', 'usr_001')
                .expect(200);

            expect(response.body.status).toBe('OK');
            expect(response.body.cantidad).toBe(1);
        });

        it('retorna 400 cuando falta el header x-user-id', async () => {
            await request(app.getHttpServer())
                .get('/academico/inscripciones/me')
                .expect(400);
        });
    });

    describe('GET /academico/inscripciones', () => {
        it('retorna 200 con todas las inscripciones para admin', async () => {
            mockObtenerInscripcionesAdminServicio.ejecutar.mockResolvedValue([inscripcionDto]);

            const response = await request(app.getHttpServer())
                .get('/academico/inscripciones')
                .expect(200);

            expect(response.body.status).toBe('OK');
            expect(response.body.cantidad).toBe(1);
        });
    });

    describe('GET /academico/comisiones', () => {
        it('retorna 200 con la lista de comisiones', async () => {
            const comisiones = [{ id_comision: 10, nombre_comision: 'Comision A', id_asignatura: 5 }];
            mockObtenerComisionesServicio.ejecutar.mockResolvedValue(comisiones);

            const response = await request(app.getHttpServer())
                .get('/academico/comisiones')
                .expect(200);

            expect(response.body.status).toBe('OK');
            expect(response.body.cantidad).toBe(1);
        });

        it('filtra por idAsignatura cuando se envía el query param', async () => {
            mockObtenerComisionesServicio.ejecutar.mockResolvedValue([]);

            await request(app.getHttpServer())
                .get('/academico/comisiones?idAsignatura=5')
                .expect(200);

            expect(mockObtenerComisionesServicio.ejecutar).toHaveBeenCalledWith(5);
        });
    });

    describe('GET /academico/asignaturas', () => {
        it('retorna 200 con la lista de asignaturas', async () => {
            const asignaturas = [{ id_asignatura: 5, nombre_asignatura: 'Matemáticas', anio_asignatura: 1 }];
            mockObtenerAsignaturasServicio.ejecutar.mockResolvedValue(asignaturas);

            const response = await request(app.getHttpServer())
                .get('/academico/asignaturas')
                .expect(200);

            expect(response.body.status).toBe('OK');
            expect(response.body.cantidad).toBe(1);
        });
    });

    describe('GET /academico/horarios', () => {
        it('retorna 200 con la lista de horarios', async () => {
            const horarios = [{ id_horario: 1, dia: 'Lunes', hora_desde: '08:00', hora_hasta: '10:00', modalidad: 'presencial', id_comision: 10 }];
            mockObtenerHorariosServicio.ejecutar.mockResolvedValue(horarios);

            const response = await request(app.getHttpServer())
                .get('/academico/horarios')
                .expect(200);

            expect(response.body.status).toBe('OK');
            expect(response.body.cantidad).toBe(1);
        });
    });
});
