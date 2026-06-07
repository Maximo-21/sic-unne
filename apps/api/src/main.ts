import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ESTA LÍNEA ES CLAVE: permite que el front (puerto 3000) le hable al back (puerto 3001)
  app.enableCors({
    origin: 'http://localhost:3000', // La URL de tu Next.js
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(3001);
}
bootstrap();