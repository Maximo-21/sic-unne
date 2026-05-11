import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Esto permite usar Prisma en cualquier parte de la API sin importarlo de nuevo
@Module({
    providers: [PrismaService],
    exports: [PrismaService],
})
export class DatabaseModule { }