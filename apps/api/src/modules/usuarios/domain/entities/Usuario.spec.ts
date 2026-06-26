import { Usuario } from './Usuario';
import { Rol } from './Rol';

function crearUsuario(descripcionRol: string | null = 'estudiante'): Usuario {
    const rol = descripcionRol ? new Rol(1, descripcionRol) : null;
    return new Usuario(
        'usr_001',
        '12345678',
        'Juan',
        'Perez',
        'juan@email.com',
        'hashed_password',
        'Ingeniería',
        rol ? rol.id : 1,
        rol,
        'activo',
        new Date(),
    );
}

describe('Usuario — métodos de dominio', () => {
    describe('obtenerNombreCompleto()', () => {
        it('retorna nombre y apellido concatenados', () => {
            expect(crearUsuario().obtenerNombreCompleto()).toBe('Juan Perez');
        });
    });

    describe('esEstudiante()', () => {
        it('retorna true cuando el rol es estudiante', () => {
            expect(crearUsuario('estudiante').esEstudiante()).toBe(true);
        });

        it('retorna false cuando el rol es admin', () => {
            expect(crearUsuario('admin').esEstudiante()).toBe(false);
        });

        it('retorna false cuando no tiene rol asignado', () => {
            expect(crearUsuario(null).esEstudiante()).toBe(false);
        });
    });

    describe('esAdministrador()', () => {
        it('retorna true cuando el rol es admin', () => {
            expect(crearUsuario('admin').esAdministrador()).toBe(true);
        });

        it('retorna false cuando el rol es estudiante', () => {
            expect(crearUsuario('estudiante').esAdministrador()).toBe(false);
        });

        it('retorna false cuando no tiene rol asignado', () => {
            expect(crearUsuario(null).esAdministrador()).toBe(false);
        });
    });
});
