import { Module } from '@nestjs/common';
import { DatabaseModule } from './shared/infrastructure/database.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './modules/usuarios/usuarios.module';

@Module({
  imports: [
    DatabaseModule,
    UsuariosModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }