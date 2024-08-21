import { ApiTags } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';

@Controller()
@ApiTags('Health')
export class HealthController {
  @Get()
  healthCheck() {
    return true;
  }
}
