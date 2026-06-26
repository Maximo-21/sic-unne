import { SolicitudIntercambio } from './SolicitudIntercambio';
import { IObservador } from '../observers/IObservador';

function solicitud(id: number, estado: string, idUsuario: string, origen: number, destino: number): SolicitudIntercambio {
    return new SolicitudIntercambio(id, estado, new Date(), idUsuario, origen, destino, null, null, null, null, null, null);
}

describe('SolicitudIntercambio — métodos de dominio', () => {

    describe('estaPendiente()', () => {
        it('retorna true cuando el estado es pendiente', () => {
            expect(solicitud(1, 'pendiente', 'u1', 10, 12).estaPendiente()).toBe(true);
        });
        it('retorna false cuando el estado es en_propuesta', () => {
            expect(solicitud(1, 'en_propuesta', 'u1', 10, 12).estaPendiente()).toBe(false);
        });
    });

    describe('puedeCancelarse()', () => {
        it('retorna true solo si está pendiente', () => {
            expect(solicitud(1, 'pendiente', 'u1', 10, 12).puedeCancelarse()).toBe(true);
        });
        it('retorna false si está en_propuesta', () => {
            expect(solicitud(1, 'en_propuesta', 'u1', 10, 12).puedeCancelarse()).toBe(false);
        });
    });

    describe('esEspejo()', () => {
        it('detecta correctamente una solicitud espejo entre dos alumnos distintos', () => {
            const a = solicitud(1, 'pendiente', 'usr_01', 101, 102);
            const b = solicitud(2, 'pendiente', 'usr_02', 102, 101);
            expect(a.esEspejo(b)).toBe(true);
        });
        it('retorna false si ambas solicitudes pertenecen al mismo usuario', () => {
            const a = solicitud(1, 'pendiente', 'usr_01', 101, 102);
            const b = solicitud(2, 'pendiente', 'usr_01', 102, 101);
            expect(a.esEspejo(b)).toBe(false);
        });
        it('retorna false si las comisiones no son simétricas', () => {
            const a = solicitud(1, 'pendiente', 'usr_01', 101, 102);
            const b = solicitud(2, 'pendiente', 'usr_02', 101, 103);
            expect(a.esEspejo(b)).toBe(false);
        });
        it('retorna false si alguna solicitud no está en estado pendiente', () => {
            const a = solicitud(1, 'en_propuesta', 'usr_01', 101, 102);
            const b = solicitud(2, 'pendiente',    'usr_02', 102, 101);
            expect(a.esEspejo(b)).toBe(false);
        });
    });

    // ── Patrón Observer (Sujeto) ──────────────────────────────────────────────

    describe('cambiarEstado() — notificación a observadores', () => {
        it('actualiza el estado interno cuando se llama cambiarEstado()', async () => {
            const sol = solicitud(1, 'pendiente', 'usr_01', 101, 102);
            await sol.cambiarEstado('en_propuesta');
            expect(sol.estado).toBe('en_propuesta');
        });

        it('notifica al observador suscrito con el evento y el sujeto correcto', async () => {
            const sol = solicitud(1, 'pendiente', 'usr_01', 101, 102);
            const observadorMock: IObservador = { actualizar: jest.fn().mockResolvedValue(undefined) };

            sol.suscribir(observadorMock);
            await sol.cambiarEstado('en_propuesta');

            expect(observadorMock.actualizar).toHaveBeenCalledTimes(1);
            expect(observadorMock.actualizar).toHaveBeenCalledWith('en_propuesta', sol);
        });

        it('notifica a múltiples observadores en orden de suscripción', async () => {
            const sol = solicitud(1, 'pendiente', 'usr_01', 101, 102);
            const orden: number[] = [];
            const obs1: IObservador = { actualizar: jest.fn().mockImplementation(async () => { orden.push(1); }) };
            const obs2: IObservador = { actualizar: jest.fn().mockImplementation(async () => { orden.push(2); }) };

            sol.suscribir(obs1);
            sol.suscribir(obs2);
            await sol.cambiarEstado('aceptada');

            expect(orden).toEqual([1, 2]);
        });

        it('no notifica al observador luego de ser desuscrito', async () => {
            const sol = solicitud(1, 'pendiente', 'usr_01', 101, 102);
            const observadorMock: IObservador = { actualizar: jest.fn().mockResolvedValue(undefined) };

            sol.suscribir(observadorMock);
            sol.desuscribir(observadorMock);
            await sol.cambiarEstado('en_propuesta');

            expect(observadorMock.actualizar).not.toHaveBeenCalled();
        });

        it('no notifica si no hay observadores suscritos', async () => {
            const sol = solicitud(1, 'pendiente', 'usr_01', 101, 102);
            await expect(sol.cambiarEstado('en_propuesta')).resolves.toBeUndefined();
            expect(sol.estado).toBe('en_propuesta');
        });
    });
});
