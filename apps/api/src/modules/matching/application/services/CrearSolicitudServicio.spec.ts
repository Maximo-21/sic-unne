import { BadRequestException } from '@nestjs/common';
import { CrearSolicitudServicio } from './CrearSolicitudServicio';
import { IRepositorioSolicitudIntercambio } from '../../domain/repositories/IRepositorioSolicitudIntercambio';
import { IRepositorioPropuesta } from '../../domain/repositories/IRepositorioPropuesta';
import { IRepositorioInscripcion } from '../../../gestion_academica/domain/repositories/IRepositorioInscripcion';
import { SolicitudIntercambio } from '../../domain/entities/SolicitudIntercambio';
import { Propuesta } from '../../domain/entities/Propuesta';
import { Inscripcion } from '../../../gestion_academica/domain/entities/Inscripcion';

// ─── Helpers para construir objetos de dominio en tests ──────────────────────

function crearSolicitud(): SolicitudIntercambio {
    return new SolicitudIntercambio(
        1,
        'pendiente',
        new Date(),
        'usr_student_01',
        10,
        12,
        null, null, null, null, null, null,
    );
}

function crearInscripcionActiva(): Inscripcion {
    return new Inscripcion(1, 'activa', new Date(), 10, 'usr_student_01', null, null);
}

function crearPropuesta(sol1: SolicitudIntercambio, sol2: SolicitudIntercambio): Propuesta {
    return new Propuesta(1, 'pendiente', 'pendiente', 'pendiente', null, sol1.id, sol2.id, sol1, sol2);
}

// ─── Mock factories ───────────────────────────────────────────────────────────

function crearMockSolicitudRepo(): jest.Mocked<IRepositorioSolicitudIntercambio> {
    return {
        buscarPorId: jest.fn(),
        obtenerPorUsuario: jest.fn(),
        obtenerPendientesPorUsuario: jest.fn(),
        guardar: jest.fn(),
        actualizarEstado: jest.fn(),
    };
}

function crearMockPropuestaRepo(): jest.Mocked<IRepositorioPropuesta> {
    return {
        buscarPorId: jest.fn(),
        obtenerPorUsuario: jest.fn(),
        obtenerTodas: jest.fn(),
        guardar: jest.fn(),
        actualizarVoto: jest.fn(),
        actualizarEstadoGeneral: jest.fn(),
        buscarEspejos: jest.fn(),
        ejecutarIntercambio: jest.fn(),
    };
}

function crearMockInscripcionRepo(): jest.Mocked<IRepositorioInscripcion> {
    return {
        guardar: jest.fn(),
        buscarPorId: jest.fn(),
        buscarPorUsuarioYComision: jest.fn(),
        buscarPorUsuarioYAsignatura: jest.fn(),
        obtenerPorUsuario: jest.fn(),
        obtenerTodas: jest.fn(),
    };
}

// ─── Suite — Plan de Prueba 2: Solicitar Intercambio ─────────────────────────

describe('CrearSolicitudServicio', () => {
    let servicio: CrearSolicitudServicio;
    let solicitudRepo: jest.Mocked<IRepositorioSolicitudIntercambio>;
    let propuestaRepo: jest.Mocked<IRepositorioPropuesta>;
    let inscripcionRepo: jest.Mocked<IRepositorioInscripcion>;

    beforeEach(() => {
        solicitudRepo   = crearMockSolicitudRepo();
        propuestaRepo   = crearMockPropuestaRepo();
        inscripcionRepo = crearMockInscripcionRepo();
        servicio        = new CrearSolicitudServicio(solicitudRepo, propuestaRepo, inscripcionRepo);
    });

    // ── CP2: comisiones idénticas — curso alternativo ────────────────────────
    it('CP2 — lanza BadRequestException cuando idComisionOrigen === idComisionDestino', async () => {
        await expect(
            servicio.ejecutar('usr_student_01', { idComisionOrigen: 10, idComisionDestino: 10 }),
        ).rejects.toThrow(new BadRequestException('Las comisiones de origen y destino no pueden ser la misma.'));

        expect(inscripcionRepo.buscarPorUsuarioYComision).not.toHaveBeenCalled();
        expect(solicitudRepo.guardar).not.toHaveBeenCalled();
    });

    // ── Caso sin inscripción activa ───────────────────────────────────────────
    it('lanza BadRequestException cuando el alumno no tiene inscripción activa en la comisión origen', async () => {
        inscripcionRepo.buscarPorUsuarioYComision.mockResolvedValue(null);

        await expect(
            servicio.ejecutar('usr_student_01', { idComisionOrigen: 10, idComisionDestino: 12 }),
        ).rejects.toThrow(new BadRequestException('No tenés inscripción activa en esa comisión.'));

        expect(solicitudRepo.guardar).not.toHaveBeenCalled();
    });

    // ── CP1: sin espejo — solicitud ingresa a la cola de espera ─────────────
    it('CP1 — persiste la solicitud con estado pendiente y retorna propuesta null cuando no hay espejo', async () => {
        const solicitudCreada = crearSolicitud();
        inscripcionRepo.buscarPorUsuarioYComision.mockResolvedValue(crearInscripcionActiva());
        solicitudRepo.guardar.mockResolvedValue(solicitudCreada);
        propuestaRepo.buscarEspejos.mockResolvedValue([]);

        const resultado = await servicio.ejecutar('usr_student_01', { idComisionOrigen: 10, idComisionDestino: 12 });

        expect(resultado.propuesta).toBeNull();
        expect(resultado.solicitud.estado).toBe('pendiente');
        expect(propuestaRepo.guardar).not.toHaveBeenCalled();
        expect(solicitudRepo.actualizarEstado).not.toHaveBeenCalled();
    });

    // ── CP3: espejo encontrado — disparo automático del matching ─────────────
    it('CP3 — dispara PropuestaObservador y crea Propuesta cuando detecta solicitud espejo', async () => {
        const solicitudActual = new SolicitudIntercambio(
            1, 'pendiente', new Date(), 'usr_student_02', 12, 10, null, null, null, null, null, null,
        );
        const solicitudEspejo = new SolicitudIntercambio(
            2, 'pendiente', new Date(), 'usr_student_01', 10, 12, null, null, null, null, null, null,
        );
        const propuestaGenerada = crearPropuesta(solicitudActual, solicitudEspejo);

        inscripcionRepo.buscarPorUsuarioYComision.mockResolvedValue(
            new Inscripcion(1, 'activa', new Date(), 12, 'usr_student_02', null, null),
        );
        solicitudRepo.guardar.mockResolvedValue(solicitudActual);
        propuestaRepo.buscarEspejos.mockResolvedValue([solicitudEspejo]);
        propuestaRepo.guardar.mockResolvedValue(propuestaGenerada);
        solicitudRepo.actualizarEstado.mockResolvedValue(undefined);

        const resultado = await servicio.ejecutar('usr_student_02', { idComisionOrigen: 12, idComisionDestino: 10 });

        // El PropuestaObservador debe haber sido notificado y creado la propuesta
        expect(propuestaRepo.guardar).toHaveBeenCalledWith(solicitudActual.id, solicitudEspejo.id);
        expect(solicitudRepo.actualizarEstado).toHaveBeenCalledWith(solicitudActual.id, 'en_propuesta');
        expect(solicitudRepo.actualizarEstado).toHaveBeenCalledWith(solicitudEspejo.id, 'en_propuesta');
        expect(resultado.propuesta).not.toBeNull();
        // La solicitud actual debe haber cambiado de estado via el Sujeto Observer
        expect(solicitudActual.estado).toBe('en_propuesta');
    });
});
