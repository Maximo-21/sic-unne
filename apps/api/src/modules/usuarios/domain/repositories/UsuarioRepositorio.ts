import { Usuario } from "../entities/Usuario";

export interface UsuarioRepositorio {
    obtenerTodos(): Promise<Usuario[]>;

    buscarPorId(id_usuario: string): Promise<Usuario | null>;

    guardar(usuario: Usuario): Promise<Usuario>;

    actualizar(id_usuario: string, datos: Partial<Omit<Usuario, 'dni' | 'contraseña'>>): Promise<Usuario>;

    darDeBaja(id_usuario: string): Promise<void>;

    activar(id_usuario: string): Promise<void>;

    buscarPorDni(dni: string): Promise<Usuario | null>;
}
