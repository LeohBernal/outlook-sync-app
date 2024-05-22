import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/health')
  public helloWorld() {
    return 'Hello World!';
  }
}
