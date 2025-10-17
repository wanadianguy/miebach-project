import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode } from '@nestjs/common';
import { PhaseService } from './phase.service';
import { CreatePhaseDto } from './dto/create-phase.dto';
import { UpdatePhaseDto } from './dto/update-phase.dto';
import { ApiOperation } from '@nestjs/swagger';

//@UseGuards(AuthenticationGuard, RolesGuard)
@Controller('phases')
export class PhaseController {
    constructor(private readonly phasesService: PhaseService) {}

    //@Roles(Role.MANAGER)
    @Post()
    @ApiOperation({ summary: 'Create a phase' })
    async create(@Body() createPhaseDto: CreatePhaseDto) {
        return this.phasesService.create(createPhaseDto);
    }

    //@Roles(Role.MANAGER)
    @Get()
    @ApiOperation({ summary: 'Get all phases' })
    async findAll() {
        return this.phasesService.findAll();
    }

    //@Roles(Role.MANAGER)
    @Get(':id')
    @ApiOperation({ summary: 'Get a phase by id' })
    async findOne(@Param('id') id: string) {
        return this.phasesService.findOne(id);
    }

    //@Roles(Role.MANAGER)
    @Get('project/:projectId')
    @ApiOperation({ summary: 'Get phases by project id' })
    async findByProject(@Param('projectId') projectId: string) {
        return this.phasesService.findByProject(projectId);
    }

    //@Roles(Role.MANAGER)
    @Patch(':id')
    @ApiOperation({ summary: 'Update a phase' })
    async update(@Param('id') id: string, @Body() updatePhaseDto: UpdatePhaseDto) {
        return this.phasesService.update(id, updatePhaseDto);
    }

    //@Roles(Role.MANAGER)
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a phase' })
    @HttpCode(204)
    async remove(@Param('id') id: string) {
        return this.phasesService.remove(id);
    }
}
