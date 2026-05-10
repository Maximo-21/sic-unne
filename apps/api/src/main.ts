import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Habilitamos CORS para que Next.js (puerto 3000) pueda hablar con Nest (puerto 3001)
  app.enableCors();

  // 2. Usamos el puerto 3001 (o el que asigne el entorno)
  await app.listen(process.env.PORT ?? 3001);

  console.log(`🚀 Backend corriendo en: http://localhost:3001`);
}
bootstrap();