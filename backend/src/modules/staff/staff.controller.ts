import { Body, Controller, Delete, Get, HttpCode, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { StaffService } from './staff.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { ApiOperation } from '@nestjs/swagger';

//@UseGuards(AuthenticationGuard, RolesGuard)
@Controller('staffing')
export class StaffController {
    constructor(private readonly staffsService: StaffService) {}

    //@Roles(Role.MANAGER)
    @Post()
    @ApiOperation({ summary: 'Create a staff' })
    create(@Body() dto: CreateStaffDto) {
        return this.staffsService.create(dto);
    }

    //@Roles(Role.MANAGER)
    @Get()
    @ApiOperation({ summary: 'Get all staffing' })
    findAll() {
        return this.staffsService.findAll();
    }

    //@Roles(Role.MANAGER)
    @Get(':id')
    @ApiOperation({ summary: 'Get a staff by id' })
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.staffsService.findOne(id);
    }

    //@Roles(Role.MANAGER)
    @Get('project/:projectId')
    @ApiOperation({ summary: 'Get staffing by project id' })
    findByProject(@Param('projectId', ParseUUIDPipe) projectId: string) {
        return this.staffsService.findByProject(projectId);
    }

    //@Roles(Role.MANAGER)
    @Get('user/:userId')
    @ApiOperation({ summary: 'Get staffing by user id' })
    findByUser(@Param('userId', ParseUUIDPipe) userId: string) {
        return this.staffsService.findByUser(userId);
    }

    //@Roles(Role.MANAGER)
    @Patch(':id')
    @ApiOperation({ summary: 'Update a staff' })
    update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateStaffDto) {
        return this.staffsService.update(id, dto);
    }

    //@Roles(Role.MANAGER)
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a staff' })
    @HttpCode(204)
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.staffsService.remove(id);
    }
}
