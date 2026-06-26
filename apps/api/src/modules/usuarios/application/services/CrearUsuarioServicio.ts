import { Injectable, Inject, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { IRepositorioUsuario } from '../../domain/repositories/IRepositorioUsuario';
import { Usuario } from '../../domain/entities/Usuario';
import { CrearUsuarioDto } from '../dto/CrearUsuarioDto';
import { UsuarioResponseDto } from '../dto/UsuarioResponseDto';
import { UsuarioMapper } from '../mappers/UsuarioMapper';

/**
 * Caso de uso: **Crear Usuario** (contrato `crearUsuario` del documento SIC-UNNE).
 *
 * Pre-condiciones:
 * - El DNI no debe estar registrado previamente.
 *
 * Post-condiciones:
 * - El usuario queda en estado `'activo'` con contraseña hasheada (bcrypt, sal=10).
 * - Se asigna un UUID como identificador único.
 *
 * @throws {ConflictException} si el DNI ya existe en el sistema
 */
@Injectable()
export class CrearUsuarioServicio {
    constructor(
        @Inject('IRepositorioUsuario')
        private readonly repositorio: IRepositorioUsuario
    ) { }

    /**
     * Ejecuta la creación del usuario.
     * @param dto — datos del formulario de alta (DNI, nombre, apellido, email, contraseña, rol)
     * @returns DTO con los datos del usuario creado (sin contraseña)
     */
    async ejecutar(dto: CrearUsuarioDto): Promise<UsuarioResponseDto> {
        const existente = await this.repositorio.buscarPorDni(dto.dni);
        if (existente) {
            throw new ConflictException(`El usuario con DNI ${dto.dni} ya existe.`);
        }

        const claveHasheada = await bcrypt.hash(dto.contrasena, 10);

        const nuevoUsuario = new Usuario(
            crypto.randomUUID(),
            dto.dni,
            dto.nombre,
            dto.apellido,
            dto.email,
            claveHasheada,
            dto.carrera ?? null,
            dto.idRol,
            null,
            'activo',
            new Date(),
        );

        const guardado = await this.repositorio.guardar(nuevoUsuario);
        return UsuarioMapper.toDto(guardado);
    }
}
