import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@repo/database';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Aseguramos la carga del .env desde la raíz
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor() {
        super({
            datasources: {
                db: {
                    url: process.env.DATABASE_URL,
                },
            },
        });
        console.log('DATABASE_URL cargada:', process.env.DATABASE_URL ? '✅ SI' : '❌ NO');
    }

    async onModuleInit() {
        try {
            await this.$connect();
            console.log('✅ Conexión a Supabase exitosa');
        } catch (error) {
            console.error('❌ Error al conectar con Supabase:', error);
        }
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}