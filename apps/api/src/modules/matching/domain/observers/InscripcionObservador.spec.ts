import { InscripcionObservador } from './InscripcionObservador';
import { IRepositorioPropuesta } from '../repositories/IRepositorioPropuesta';
import { SolicitudIntercambio } from '../entities/SolicitudIntercambio';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function crearSolicitud(id: number): SolicitudIntercambio {
    return new SolicitudIntercambio(id, 'en_propuesta', new Date(), 'usr_01', 101, 102, null, null, null, null, null, null);
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

// ─── Suite ────────────────────────────────────────────────────────────────────

describe('InscripcionObservador', () => {
    let propuestaRepo: jest.Mocked<IRepositorioPropuesta>;

    beforeEach(() => {
        propuestaRepo = crearMockPropuestaRepo();
        propuestaRepo.ejecutarIntercambio.mockResolvedValue(undefined);
        propuestaRepo.actualizarEstadoGeneral.mockResolvedValue(undefined);
    });

    it('ejecuta el intercambio y actualiza la propuesta a aceptada cuando recibe evento aceptada', async () => {
        const sujeto = crearSolicitud(1);
        const observador = new InscripcionObservador(propuestaRepo, 42);

        await observador.actualizar('aceptada', sujeto);

        expect(propuestaRepo.ejecutarIntercambio).toHaveBeenCalledWith(42);
        expect(propuestaRepo.actualizarEstadoGeneral).toHaveBeenCalledWith(42, 'aceptada');
    });

    it('no realiza operaciones cuando el evento no es aceptada', async () => {
        const sujeto = crearSolicitud(1);
        const observador = new InscripcionObservador(propuestaRepo, 42);

        await observador.actualizar('rechazada', sujeto);
        await observador.actualizar('en_propuesta', sujeto);
        await observador.actualizar('cancelada', sujeto);

        expect(propuestaRepo.ejecutarIntercambio).not.toHaveBeenCalled();
        expect(propuestaRepo.actualizarEstadoGeneral).not.toHaveBeenCalled();
    });

    it('usa el idPropuesta correcto al llamar a los repositorios', async () => {
        const sujeto = crearSolicitud(5);
        const observador = new InscripcionObservador(propuestaRepo, 99);

        await observador.actualizar('aceptada', sujeto);

        expect(propuestaRepo.ejecutarIntercambio).toHaveBeenCalledWith(99);
        expect(propuestaRepo.actualizarEstadoGeneral).toHaveBeenCalledWith(99, 'aceptada');
    });

    it('se integra correctamente con cambiarEstado() de SolicitudIntercambio como Sujeto', async () => {
        const sujeto = crearSolicitud(1);
        const observador = new InscripcionObservador(propuestaRepo, 10);

        sujeto.suscribir(observador);
        await sujeto.cambiarEstado('aceptada');

        expect(sujeto.estado).toBe('aceptada');
        expect(propuestaRepo.ejecutarIntercambio).toHaveBeenCalledWith(10);
        expect(propuestaRepo.actualizarEstadoGeneral).toHaveBeenCalledWith(10, 'aceptada');
    });
});
