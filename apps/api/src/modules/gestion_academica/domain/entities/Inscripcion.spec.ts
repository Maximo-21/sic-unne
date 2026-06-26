import { Inscripcion } from './Inscripcion';

function inscripcion(estado: string): Inscripcion {
    return new Inscripcion(1, estado, new Date(), 10, 'usr_001', 'Comision A', 'Matemáticas');
}

describe('Inscripcion — métodos de dominio', () => {
    describe('estaActiva()', () => {
        it('retorna true cuando el estado es activa', () => {
            expect(inscripcion('activa').estaActiva()).toBe(true);
        });

        it('retorna false cuando el estado es inactiva', () => {
            expect(inscripcion('inactiva').estaActiva()).toBe(false);
        });

        it('retorna false cuando el estado es cancelada', () => {
            expect(inscripcion('cancelada').estaActiva()).toBe(false);
        });
    });

    describe('puedeParticiparEnIntercambio()', () => {
        it('retorna true cuando la inscripción está activa', () => {
            expect(inscripcion('activa').puedeParticiparEnIntercambio()).toBe(true);
        });

        it('retorna false cuando la inscripción no está activa', () => {
            expect(inscripcion('inactiva').puedeParticiparEnIntercambio()).toBe(false);
        });
    });

    describe('perteneceAUsuario()', () => {
        it('retorna true cuando el idUsuario coincide', () => {
            expect(inscripcion('activa').perteneceAUsuario('usr_001')).toBe(true);
        });

        it('retorna false cuando el idUsuario no coincide', () => {
            expect(inscripcion('activa').perteneceAUsuario('usr_999')).toBe(false);
        });
    });
});
