import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { CancelarSolicitudServicio } from './CancelarSolicitudServicio';
import { IRepositorioSolicitudIntercambio } from '../../domain/repositories/IRepositorioSolicitudIntercambio';
import { SolicitudIntercambio } from '../../domain/entities/SolicitudIntercambio';

function crearMockRepo(): jest.Mocked<IRepositorioSolicitudIntercambio> {
    return {
        buscarPorId: jest.fn(),
        obtenerPorUsuario: jest.fn(),
        obtenerPendientesPorUsuario: jest.fn(),
        guardar: jest.fn(),
        actualizarEstado: jest.fn(),
    };
}

function crearSolicitud(estado: string, idUsuario = 'usr_001'): SolicitudIntercambio {
    return new SolicitudIntercambio(
        1, estado, new Date(), idUsuario, 101, 102,
        null, null, null, null, null, null,
    );
}

describe('CancelarSolicitudServicio', () => {
    let servicio: CancelarSolicitudServicio;
    let repositorio: jest.Mocked<IRepositorioSolicitudIntercambio>;

    beforeEach(() => {
        repositorio = crearMockRepo();
        servicio = new CancelarSolicitudServicio(repositorio);
    });

    it('lanza NotFoundException cuando la solicitud no existe', async () => {
        repositorio.buscarPorId.mockResolvedValue(null);

        await expect(servicio.ejecutar(1, 'usr_001')).rejects.toThrow(
            new NotFoundException('Solicitud 1 no encontrada.'),
        );

        expect(repositorio.actualizarEstado).not.toHaveBeenCalled();
    });

    it('lanza ForbiddenException cuando la solicitud no pertenece al usuario', async () => {
        repositorio.buscarPorId.mockResolvedValue(crearSolicitud('pendiente', 'usr_otro'));

        await expect(servicio.ejecutar(1, 'usr_001')).rejects.toThrow(
            new ForbiddenException('No tenés permisos para cancelar esta solicitud.'),
        );

        expect(repositorio.actualizarEstado).not.toHaveBeenCalled();
    });

    it('lanza BadRequestException cuando la solicitud está en_propuesta y no puede cancelarse', async () => {
        repositorio.buscarPorId.mockResolvedValue(crearSolicitud('en_propuesta', 'usr_001'));

        await expect(servicio.ejecutar(1, 'usr_001')).rejects.toThrow(
            new BadRequestException('La solicitud no puede cancelarse en su estado actual.'),
        );

        expect(repositorio.actualizarEstado).not.toHaveBeenCalled();
    });

    it('cancela la solicitud correctamente cuando está pendiente y pertenece al usuario', async () => {
        repositorio.buscarPorId.mockResolvedValue(crearSolicitud('pendiente', 'usr_001'));
        repositorio.actualizarEstado.mockResolvedValue(undefined);

        await servicio.ejecutar(1, 'usr_001');

        expect(repositorio.actualizarEstado).toHaveBeenCalledWith(1, 'cancelada');
    });
});
