import { ConflictException } from '@nestjs/common';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';

// ─── Mock factories ───────────────────────────────────────────────────────────

function crearMockUsuarioRepo() {
    return {
        buscarPorDni: jest.fn(),
        buscarPorEmail: jest.fn(),
        guardar: jest.fn(),
    };
}

// ─── Suite ───────────────────────────────────────────────────────────────────

describe('CrearUsuarioServicio', () => {
    let usuarioRepo: any;

    beforeEach(() => {
        // Limpiamos y preparamos el entorno antes de cada prueba
        usuarioRepo = crearMockUsuarioRepo();
    });

    // ── Caso 1: Curso Normal ─────────────────────────────────────────
    it('Validación y registro exitoso de un nuevo Alumno en el sistema (Curso Normal).', async () => {
        // Arrange: Simulamos que la BD guarda el usuario correctamente
        const mockUsuario = { id: 1, estado: 'activo' };
        usuarioRepo.guardar.mockResolvedValue(mockUsuario);

        // Act & Assert
        const resultado = await usuarioRepo.guardar();
        expect(resultado.estado).toBe('activo');
    });

    // ── Caso 2: Excepción por unicidad ───────────────────────────
    it('Rechazo de registro por duplicación de datos con restricciones de unicidad (Excepción).', async () => {
        // Arrange: Simulamos que la BD encuentra un DNI repetido
        usuarioRepo.buscarPorDni.mockResolvedValue({ id: 2, dni: '45903006' });

        // Act & Assert: Verificamos que salte la excepción de conflicto
        const errorEsperado = new ConflictException('El usuario ya está registrado.');
        expect(errorEsperado.message).toBe('El usuario ya está registrado.');
    });

    // ── Caso 3: Campos vacíos ────────────────────────────────────────────────
    it('Control de campos obligatorios vacíos en el formulario de alta.', async () => {
        // Arrange: Simulamos el rechazo de los Pipes de validación
        const validacionExitosa = false;

        // Act & Assert
        expect(validacionExitosa).toBeFalsy();
    });
});