import { PropuestaObservador } from './PropuestaObservador';
import { IRepositorioPropuesta } from '../repositories/IRepositorioPropuesta';
import { IRepositorioSolicitudIntercambio } from '../repositories/IRepositorioSolicitudIntercambio';
import { SolicitudIntercambio } from '../entities/SolicitudIntercambio';
import { Propuesta } from '../entities/Propuesta';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function crearSolicitud(id: number, idUsuario: string, origen: number, destino: number): SolicitudIntercambio {
    return new SolicitudIntercambio(id, 'pendiente', new Date(), idUsuario, origen, destino, null, null, null, null, null, null);
}

function crearPropuestaGuardada(id: number, sol1: SolicitudIntercambio, sol2: SolicitudIntercambio): Propuesta {
    return new Propuesta(id, 'pendiente', 'pendiente', 'pendiente', null, sol1.id, sol2.id, sol1, sol2);
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

function crearMockSolicitudRepo(): jest.Mocked<IRepositorioSolicitudIntercambio> {
    return {
        buscarPorId: jest.fn(),
        obtenerPorUsuario: jest.fn(),
        obtenerPendientesPorUsuario: jest.fn(),
        guardar: jest.fn(),
        actualizarEstado: jest.fn(),
    };
}

// ─── Suite ────────────────────────────────────────────────────────────────────

describe('PropuestaObservador', () => {
    let propuestaRepo: jest.Mocked<IRepositorioPropuesta>;
    let solicitudRepo: jest.Mocked<IRepositorioSolicitudIntercambio>;

    beforeEach(() => {
        propuestaRepo  = crearMockPropuestaRepo();
        solicitudRepo  = crearMockSolicitudRepo();
        solicitudRepo.actualizarEstado.mockResolvedValue(undefined);
    });

    it('crea la propuesta y actualiza ambas solicitudes a en_propuesta cuando recibe evento en_propuesta', async () => {
        const sujeto = crearSolicitud(1, 'usr_01', 101, 102);
        const espejo = crearSolicitud(2, 'usr_02', 102, 101);
        const propuestaGuardada = crearPropuestaGuardada(10, sujeto, espejo);

        propuestaRepo.guardar.mockResolvedValue(propuestaGuardada);

        const observador = new PropuestaObservador(propuestaRepo, solicitudRepo, espejo);
        await observador.actualizar('en_propuesta', sujeto);

        expect(propuestaRepo.guardar).toHaveBeenCalledWith(sujeto.id, espejo.id);
        expect(solicitudRepo.actualizarEstado).toHaveBeenCalledWith(sujeto.id, 'en_propuesta');
        expect(solicitudRepo.actualizarEstado).toHaveBeenCalledWith(espejo.id, 'en_propuesta');
        expect(observador.propuestaCreada).toBe(propuestaGuardada);
    });

    it('no realiza operaciones cuando el evento no es en_propuesta', async () => {
        const sujeto = crearSolicitud(1, 'usr_01', 101, 102);
        const espejo = crearSolicitud(2, 'usr_02', 102, 101);

        const observador = new PropuestaObservador(propuestaRepo, solicitudRepo, espejo);
        await observador.actualizar('cancelada', sujeto);

        expect(propuestaRepo.guardar).not.toHaveBeenCalled();
        expect(solicitudRepo.actualizarEstado).not.toHaveBeenCalled();
        expect(observador.propuestaCreada).toBeNull();
    });

    it('expone la propuesta creada a través de propuestaCreada para que el servicio pueda leerla', async () => {
        const sujeto = crearSolicitud(3, 'usr_03', 201, 202);
        const espejo = crearSolicitud(4, 'usr_04', 202, 201);
        const propuestaGuardada = crearPropuestaGuardada(20, sujeto, espejo);

        propuestaRepo.guardar.mockResolvedValue(propuestaGuardada);

        const observador = new PropuestaObservador(propuestaRepo, solicitudRepo, espejo);
        expect(observador.propuestaCreada).toBeNull();

        await observador.actualizar('en_propuesta', sujeto);

        expect(observador.propuestaCreada).not.toBeNull();
        expect(observador.propuestaCreada?.id).toBe(20);
    });

    it('se integra correctamente con cambiarEstado() de SolicitudIntercambio como Sujeto', async () => {
        const sujeto = crearSolicitud(1, 'usr_01', 101, 102);
        const espejo = crearSolicitud(2, 'usr_02', 102, 101);
        const propuestaGuardada = crearPropuestaGuardada(10, sujeto, espejo);

        propuestaRepo.guardar.mockResolvedValue(propuestaGuardada);

        const observador = new PropuestaObservador(propuestaRepo, solicitudRepo, espejo);
        sujeto.suscribir(observador);
        await sujeto.cambiarEstado('en_propuesta');

        expect(sujeto.estado).toBe('en_propuesta');
        expect(propuestaRepo.guardar).toHaveBeenCalledWith(1, 2);
        expect(observador.propuestaCreada).toBe(propuestaGuardada);
    });
});
