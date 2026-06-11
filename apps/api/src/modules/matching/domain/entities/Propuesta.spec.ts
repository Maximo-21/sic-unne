import { Propuesta } from './Propuesta';
import { SolicitudIntercambio } from './SolicitudIntercambio';

function sol(idUsuario: string): SolicitudIntercambio {
    return new SolicitudIntercambio(1, 'en_propuesta', new Date(), idUsuario, 101, 102, null, null, null, null, null, null);
}

function propuesta(estadoGeneral: string, estadoAlumno1: string, estadoAlumno2: string): Propuesta {
    return new Propuesta(1, estadoGeneral, estadoAlumno1, estadoAlumno2, null, 10, 11, sol('usr_01'), sol('usr_02'));
}

describe('Propuesta — métodos de dominio', () => {

    describe('estaPendiente()', () => {
        it('retorna true cuando el estado general es pendiente', () => {
            expect(propuesta('pendiente', 'pendiente', 'pendiente').estaPendiente()).toBe(true);
        });
        it('retorna false cuando el estado general es aceptada', () => {
            expect(propuesta('aceptada', 'aceptado', 'aceptado').estaPendiente()).toBe(false);
        });
    });

    describe('ambosHanAceptado()', () => {
        it('retorna true solo cuando ambos alumnos tienen estado aceptado', () => {
            expect(propuesta('pendiente', 'aceptado', 'aceptado').ambosHanAceptado()).toBe(true);
        });
        it('retorna false si solo uno aceptó', () => {
            expect(propuesta('pendiente', 'aceptado', 'pendiente').ambosHanAceptado()).toBe(false);
        });
        it('retorna false si ninguno aceptó', () => {
            expect(propuesta('pendiente', 'pendiente', 'pendiente').ambosHanAceptado()).toBe(false);
        });
    });

    describe('tieneRechazo()', () => {
        it('retorna true si el alumno 1 rechazó', () => {
            expect(propuesta('pendiente', 'rechazado', 'pendiente').tieneRechazo()).toBe(true);
        });
        it('retorna true si el alumno 2 rechazó', () => {
            expect(propuesta('pendiente', 'pendiente', 'rechazado').tieneRechazo()).toBe(true);
        });
        it('retorna false si ninguno rechazó', () => {
            expect(propuesta('pendiente', 'aceptado', 'pendiente').tieneRechazo()).toBe(false);
        });
    });

    describe('puedeEjecutarse()', () => {
        it('retorna true cuando ambos aceptaron, la propuesta está pendiente y tiene solicitudes', () => {
            expect(propuesta('pendiente', 'aceptado', 'aceptado').puedeEjecutarse()).toBe(true);
        });
        it('retorna false si la propuesta ya no está pendiente', () => {
            expect(propuesta('aceptada', 'aceptado', 'aceptado').puedeEjecutarse()).toBe(false);
        });
    });
});
