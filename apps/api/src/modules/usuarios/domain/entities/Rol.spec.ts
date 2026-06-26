import { Rol } from './Rol';

describe('Rol — métodos de dominio', () => {
    describe('esEstudiante()', () => {
        it('retorna true cuando la descripción es estudiante', () => {
            expect(new Rol(1, 'estudiante').esEstudiante()).toBe(true);
        });

        it('retorna false cuando la descripción es admin', () => {
            expect(new Rol(2, 'admin').esEstudiante()).toBe(false);
        });

        it('retorna false para cualquier otra descripción', () => {
            expect(new Rol(3, 'superadmin').esEstudiante()).toBe(false);
        });
    });

    describe('esAdministrador()', () => {
        it('retorna true cuando la descripción es admin', () => {
            expect(new Rol(2, 'admin').esAdministrador()).toBe(true);
        });

        it('retorna false cuando la descripción es estudiante', () => {
            expect(new Rol(1, 'estudiante').esAdministrador()).toBe(false);
        });

        it('retorna false para cualquier otra descripción', () => {
            expect(new Rol(3, 'moderador').esAdministrador()).toBe(false);
        });
    });
});
