import { Module } from '@nestjs/common';
import { DatabaseModule }  from './shared/infrastructure/database.module';
import { AppController }   from './app.controller';
import { AppService }      from './app.service';
import { UsuariosModule }  from './modules/usuarios/usuarios.module';
import { AuthModule }      from './modules/auth/auth.module';
import { MatchingModule }         from './modules/matching/matching.module';
import { GestionAcademicaModule } from './modules/gestion_academica/gestion-academica.module';

@Module({
  imports: [DatabaseModule, UsuariosModule, AuthModule, GestionAcademicaModule, MatchingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }