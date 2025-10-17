import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get('health')
    @ApiOperation({ summary: 'Check the health of the application' })
    @ApiResponse({ status: 200, schema: { type: 'string', example: 'OK' } })
    healthCheck(): string {
        return this.appService.healthCheck();
    }
}
