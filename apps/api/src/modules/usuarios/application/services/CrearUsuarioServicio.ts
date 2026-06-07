import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { UsuarioRepositorio } from '../../domain/repositories/UsuarioRepositorio';
import { Usuario } from '../../domain/entities/Usuario';
import { CrearUsuarioDto } from '../../dto/crear-usuario.dto';
import { UsuarioResponseDto } from '../../dto/usuario-response.dto';

@Injectable()
export class CrearUsuarioServicio {
    constructor(
        @Inject('UsuarioRepositorio')
        private readonly repositorio: UsuarioRepositorio
    ) { }

    async ejecutar(dto: CrearUsuarioDto): Promise<UsuarioResponseDto> {
        // REGLA DE ORO: Validar que el DNI no esté duplicado
        const usuarioExistente = await this.repositorio.buscarPorDni(dto.dni);
        if (usuarioExistente) {
            throw new ConflictException(`El usuario con DNI ${dto.dni} ya existe.`);
        }

        // Creamos la entidad Usuario (Inyectando un ID único de forma simple)
        const nuevoUsuario = new Usuario(
            crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2),
            dto.dni,
            dto.nombre,
            dto.apellido,
            dto.email,
            dto.contrasena,
            dto.rol,
            'activo', // Estado activo por defecto
            new Date()
        );

        const usuarioGuardado = await this.repositorio.guardar(nuevoUsuario);
        
        // Devolvemos la respuesta filtrada sin contraseña
        return UsuarioResponseDto.desdeEntidad(usuarioGuardado);
    }
}