import { NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { VotarPropuestaServicio } from './VotarPropuestaServicio';
import { IRepositorioPropuesta } from '../../domain/repositories/IRepositorioPropuesta';
import { IRepositorioSolicitudIntercambio } from '../../domain/repositories/IRepositorioSolicitudIntercambio';
import { Propuesta } from '../../domain/entities/Propuesta';
import { SolicitudIntercambio } from '../../domain/entities/SolicitudIntercambio';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function crearSolicitud(id: number, idUsuario: string, origen: number, destino: number): SolicitudIntercambio {
    return new SolicitudIntercambio(id, 'en_propuesta', new Date(), idUsuario, origen, destino, null, null, null, null, null, null);
}

function crearPropuesta(overrides: {
    id?: number;
    estadoGeneral?: string;
    estadoAlumno1?: string;
    estadoAlumno2?: string;
    solicitud1?: SolicitudIntercambio | null;
    solicitud2?: SolicitudIntercambio | null;
} = {}): Propuesta {
    const sol1 = overrides.solicitud1 !== undefined
        ? overrides.solicitud1
        : crearSolicitud(10, 'usr_student_01', 101, 102);
    const sol2 = overrides.solicitud2 !== undefined
        ? overrides.solicitud2
        : crearSolicitud(11, 'usr_student_02', 102, 101);

    return new Propuesta(
        overrides.id            ?? 1,
        overrides.estadoGeneral ?? 'pendiente',
        overrides.estadoAlumno1 ?? 'pendiente',
        overrides.estadoAlumno2 ?? 'pendiente',
        null,
        sol1?.id ?? 10,
        sol2?.id ?? 11,
        sol1,
        sol2,
    );
}

// ─── Mock factories ───────────────────────────────────────────────────────────

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

function crearMockSolicitudRepo(): jest.Mocked<IRepositorioSolicitudIntercambio> {
    return {
        buscarPorId: jest.fn(),
        obtenerPorUsuario: jest.fn(),
        obtenerPendientesPorUsuario: jest.fn(),
        guardar: jest.fn(),
        actualizarEstado: jest.fn(),
    };
}

// ─── Suite ───────────────────────────────────────────────────────────────────

describe('VotarPropuestaServicio', () => {
    let servicio: VotarPropuestaServicio;
    let propuestaRepo: jest.Mocked<IRepositorioPropuesta>;
    let solicitudRepo: jest.Mocked<IRepositorioSolicitudIntercambio>;

    beforeEach(() => {
        propuestaRepo = crearMockPropuestaRepo();
        solicitudRepo = crearMockSolicitudRepo();
        servicio      = new VotarPropuestaServicio(propuestaRepo, solicitudRepo);
    });

    // ── Caso 1: propuesta inexistente ─────────────────────────────────────────
    it('lanza NotFoundException cuando la propuesta no existe en el repositorio', async () => {
        propuestaRepo.buscarPorId.mockResolvedValue(null);

        await expect(
            servicio.ejecutar(999, 'usr_student_01', { voto: 'aceptado' }),
        ).rejects.toThrow(new NotFoundException('Propuesta 999 no encontrada.'));
    });

    // ── Caso 2: usuario no pertenece a la propuesta ───────────────────────────
    it('lanza ForbiddenException cuando el usuario no pertenece a la propuesta', async () => {
        propuestaRepo.buscarPorId.mockResolvedValue(crearPropuesta());

        await expect(
            servicio.ejecutar(1, 'usr_hacker_99', { voto: 'aceptado' }),
        ).rejects.toThrow(new ForbiddenException('No pertenecés a esta propuesta.'));
    });

    // ── Caso 3: alumno ya votó ────────────────────────────────────────────────
    it('lanza BadRequestException cuando el alumno ya registró su voto', async () => {
        // alumno1 ya aceptó
        const propuestaConVoto = crearPropuesta({ estadoAlumno1: 'aceptado' });
        propuestaRepo.buscarPorId.mockResolvedValue(propuestaConVoto);

        await expect(
            servicio.ejecutar(1, 'usr_student_01', { voto: 'aceptado' }),
        ).rejects.toThrow(new BadRequestException('Ya registraste tu voto en esta propuesta.'));
    });

    // ── Caso 4: un alumno rechaza — propuesta rechazada, solicitudes vuelven a pendiente
    it('marca la propuesta como rechazada y devuelve ambas solicitudes a pendiente cuando alguien rechaza', async () => {
        const propuestaOriginal = crearPropuesta();
        const propuestaConRechazo = crearPropuesta({ estadoAlumno1: 'rechazado' });
        const propuestaFinal      = crearPropuesta({ estadoGeneral: 'rechazada', estadoAlumno1: 'rechazado' });

        propuestaRepo.buscarPorId
            .mockResolvedValueOnce(propuestaOriginal) // primera llamada (validación)
            .mockResolvedValueOnce(propuestaFinal);   // segunda llamada (buscarPorId al final)

        propuestaRepo.actualizarVoto.mockResolvedValue(propuestaConRechazo);
        propuestaRepo.actualizarEstadoGeneral.mockResolvedValue();
        solicitudRepo.actualizarEstado.mockResolvedValue();

        const resultado = await servicio.ejecutar(1, 'usr_student_01', { voto: 'rechazado' });

        expect(propuestaRepo.actualizarEstadoGeneral).toHaveBeenCalledWith(1, 'rechazada');
        expect(solicitudRepo.actualizarEstado).toHaveBeenCalledWith(10, 'pendiente');
        expect(solicitudRepo.actualizarEstado).toHaveBeenCalledWith(11, 'pendiente');
        expect(propuestaRepo.ejecutarIntercambio).not.toHaveBeenCalled();
        expect(resultado).toBeDefined();
    });

    // ── Caso 5: ambos aceptan — ejecuta el intercambio ───────────────────────
    it('ejecuta el intercambio y marca la propuesta como aceptada cuando ambos alumnos aceptan', async () => {
        // Alumno 1 ya aceptó; alumno 2 acaba de votar 'aceptado'
        const propuestaConAlumno1Aceptado = crearPropuesta({ estadoAlumno1: 'aceptado' });
        const propuestaAmbosAceptaron     = crearPropuesta({ estadoAlumno1: 'aceptado', estadoAlumno2: 'aceptado' });
        const propuestaFinal              = crearPropuesta({ estadoGeneral: 'aceptada', estadoAlumno1: 'aceptado', estadoAlumno2: 'aceptado' });

        propuestaRepo.buscarPorId
            .mockResolvedValueOnce(propuestaConAlumno1Aceptado)
            .mockResolvedValueOnce(propuestaFinal);

        propuestaRepo.actualizarVoto.mockResolvedValue(propuestaAmbosAceptaron);
        propuestaRepo.ejecutarIntercambio.mockResolvedValue();
        propuestaRepo.actualizarEstadoGeneral.mockResolvedValue();

        const resultado = await servicio.ejecutar(1, 'usr_student_02', { voto: 'aceptado' });

        expect(propuestaRepo.ejecutarIntercambio).toHaveBeenCalledWith(1);
        expect(propuestaRepo.actualizarEstadoGeneral).toHaveBeenCalledWith(1, 'aceptada');
        expect(solicitudRepo.actualizarEstado).not.toHaveBeenCalled();
        expect(resultado).toBeDefined();
    });
});
