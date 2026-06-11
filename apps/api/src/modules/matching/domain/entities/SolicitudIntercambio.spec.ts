import { SolicitudIntercambio } from './SolicitudIntercambio';

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
});
