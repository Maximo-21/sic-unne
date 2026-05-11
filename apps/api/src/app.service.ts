import { Injectable } from '@nestjs/common';
import { PrismaService } from './database/prisma.service'; // Importamos tu servicio

@Injectable()
export class AppService {
  // Inyectamos Prisma para poder usarlo
  constructor(private prisma: PrismaService) { }

  async getHello() {
    try {
      // Intentamos traer los usuarios de la base de datos
      const usuarios = await this.prisma.usuario.findMany();

      return {
        status: 'OK',
        message: '¡API y Base de Datos conectadas con éxito!',
        database_count: usuarios.length,
        data: usuarios,
      };
    } catch (error) {
      return {
        status: 'Error',
        message: 'La API funciona pero no pudo hablar con Supabase',
        error: error.message,
      };
    }
  }
}