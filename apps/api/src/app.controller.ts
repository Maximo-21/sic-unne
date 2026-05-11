import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  // 1. Agregamos "async"
  // 2. Quitamos el ": string" porque ya no devuelve solo un texto
  async getHello() {
    return await this.appService.getHello();
  }
}