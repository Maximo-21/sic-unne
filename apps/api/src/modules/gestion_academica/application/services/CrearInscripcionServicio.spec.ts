import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { CrearInscripcionServicio } from './CrearInscripcionServicio';
import { IRepositorioInscripcion } from '../../domain/repositories/IRepositorioInscripcion';
import { IRepositorioComision } from '../../domain/repositories/IRepositorioComision';
import { Comision } from '../../domain/entities/Comision';
import { Inscripcion } from '../../domain/entities/Inscripcion';

function crearMockInscripcionRepo(): jest.Mocked<IRepositorioInscripcion> {
    return {
        guardar: jest.fn(),
        buscarPorId: jest.fn(),
        buscarPorUsuarioYComision: jest.fn(),
        buscarPorUsuarioYAsignatura: jest.fn(),
        obtenerPorUsuario: jest.fn(),
        obtenerTodas: jest.fn(),
    };
}

function crearMockComisionRepo(): jest.Mocked<IRepositorioComision> {
    return {
        obtenerTodas: jest.fn(),
        obtenerPorAsignatura: jest.fn(),
        buscarPorId: jest.fn(),
    };
}

const comision = new Comision(10, 'Comision A', 5);
const inscripcionActiva = new Inscripcion(1, 'activa', new Date(), 10, 'usr_001', 'Comision A', 'Matemáticas');
const inscripcionGuardada = new Inscripcion(99, 'activa', new Date(), 10, 'usr_001', 'Comision A', 'Matemáticas');

describe('CrearInscripcionServicio', () => {
    let servicio: CrearInscripcionServicio;
    let inscripcionRepo: jest.Mocked<IRepositorioInscripcion>;
    let comisionRepo: jest.Mocked<IRepositorioComision>;

    beforeEach(() => {
        inscripcionRepo = crearMockInscripcionRepo();
        comisionRepo = crearMockComisionRepo();
        servicio = new CrearInscripcionServicio(inscripcionRepo, comisionRepo);
    });

    it('lanza NotFoundException cuando la comisión no existe', async () => {
        comisionRepo.buscarPorId.mockResolvedValue(null);

        await expect(
            servicio.ejecutar('usr_001', { idComision: 10 }),
        ).rejects.toThrow(new NotFoundException('Comisión 10 no encontrada.'));

        expect(inscripcionRepo.guardar).not.toHaveBeenCalled();
    });

    it('lanza ConflictException cuando el usuario ya está inscripto en esa comisión', async () => {
        comisionRepo.buscarPorId.mockResolvedValue(comision);
        inscripcionRepo.buscarPorUsuarioYComision.mockResolvedValue(inscripcionActiva);

        await expect(
            servicio.ejecutar('usr_001', { idComision: 10 }),
        ).rejects.toThrow(new ConflictException('Ya estás inscripto en la comisión 10.'));

        expect(inscripcionRepo.guardar).not.toHaveBeenCalled();
    });

    it('lanza BadRequestException cuando ya tiene inscripción activa en la misma asignatura', async () => {
        comisionRepo.buscarPorId.mockResolvedValue(comision);
        inscripcionRepo.buscarPorUsuarioYComision.mockResolvedValue(null);
        inscripcionRepo.buscarPorUsuarioYAsignatura.mockResolvedValue(inscripcionActiva);

        await expect(
            servicio.ejecutar('usr_001', { idComision: 10 }),
        ).rejects.toThrow(BadRequestException);

        expect(inscripcionRepo.guardar).not.toHaveBeenCalled();
    });

    it('crea la inscripción correctamente cuando no hay conflictos', async () => {
        comisionRepo.buscarPorId.mockResolvedValue(comision);
        inscripcionRepo.buscarPorUsuarioYComision.mockResolvedValue(null);
        inscripcionRepo.buscarPorUsuarioYAsignatura.mockResolvedValue(null);
        inscripcionRepo.guardar.mockResolvedValue(inscripcionGuardada);

        const resultado = await servicio.ejecutar('usr_001', { idComision: 10 });

        expect(inscripcionRepo.guardar).toHaveBeenCalledTimes(1);
        expect(resultado.estado).toBe('activa');
        expect(resultado.id_comision).toBe(10);
    });

    it('pasa la inscripción con estado activa y el idComision correcto al repositorio', async () => {
        comisionRepo.buscarPorId.mockResolvedValue(comision);
        inscripcionRepo.buscarPorUsuarioYComision.mockResolvedValue(null);
        inscripcionRepo.buscarPorUsuarioYAsignatura.mockResolvedValue(null);
        inscripcionRepo.guardar.mockResolvedValue(inscripcionGuardada);

        await servicio.ejecutar('usr_001', { idComision: 10 });

        const inscripcionPasada = inscripcionRepo.guardar.mock.calls[0][0] as Inscripcion;
        expect(inscripcionPasada.estado).toBe('activa');
        expect(inscripcionPasada.idComision).toBe(10);
        expect(inscripcionPasada.idUsuario).toBe('usr_001');
    });
});
