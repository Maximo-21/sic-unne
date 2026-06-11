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

// ─── Suite ───────────────────────────────────────────────────────────────────

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

    // ── Caso 1: comisiones idénticas ─────────────────────────────────────────
    it('lanza BadRequestException cuando idComisionOrigen === idComisionDestino', async () => {
        await expect(
            servicio.ejecutar('usr_student_01', { idComisionOrigen: 10, idComisionDestino: 10 }),
        ).rejects.toThrow(new BadRequestException('Las comisiones de origen y destino no pueden ser la misma.'));

        // El repo nunca debe ser consultado si falla la validación inicial
        expect(inscripcionRepo.buscarPorUsuarioYComision).not.toHaveBeenCalled();
        expect(solicitudRepo.guardar).not.toHaveBeenCalled();
    });

    // ── Caso 2: sin inscripción activa ───────────────────────────────────────
    it('lanza BadRequestException cuando el alumno no tiene inscripción activa en la comisión origen', async () => {
        inscripcionRepo.buscarPorUsuarioYComision.mockResolvedValue(null);

        await expect(
            servicio.ejecutar('usr_student_01', { idComisionOrigen: 10, idComisionDestino: 12 }),
        ).rejects.toThrow(new BadRequestException('No tenés inscripción activa en esa comisión.'));

        expect(solicitudRepo.guardar).not.toHaveBeenCalled();
    });

    // ── Caso 3: sin espejo — solicitud queda pendiente ───────────────────────
    it('persiste la solicitud con estado pendiente y retorna propuesta null cuando no hay espejo', async () => {
        const solicitudCreada = crearSolicitud();
        inscripcionRepo.buscarPorUsuarioYComision.mockResolvedValue(crearInscripcionActiva());
        solicitudRepo.guardar.mockResolvedValue(solicitudCreada);
        propuestaRepo.buscarEspejos.mockResolvedValue([]);

        const resultado = await servicio.ejecutar('usr_student_01', { idComisionOrigen: 10, idComisionDestino: 12 });

        expect(resultado.propuesta).toBeNull();
        expect(propuestaRepo.guardar).not.toHaveBeenCalled();
        expect(solicitudRepo.actualizarEstado).not.toHaveBeenCalled();
    });

    // ── Caso 4: espejo encontrado — crea propuesta y bloquea ambas ───────────
    it('crea una Propuesta y actualiza ambas solicitudes a en_propuesta cuando detecta espejo', async () => {
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
        solicitudRepo.actualizarEstado.mockResolvedValue();

        const resultado = await servicio.ejecutar('usr_student_02', { idComisionOrigen: 12, idComisionDestino: 10 });

        expect(propuestaRepo.guardar).toHaveBeenCalledWith(solicitudActual.id, solicitudEspejo.id);
        expect(solicitudRepo.actualizarEstado).toHaveBeenCalledWith(solicitudActual.id, 'en_propuesta');
        expect(solicitudRepo.actualizarEstado).toHaveBeenCalledWith(solicitudEspejo.id, 'en_propuesta');
        expect(resultado.propuesta).not.toBeNull();
    });
});
