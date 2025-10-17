import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ApiOperation } from '@nestjs/swagger';

//@UseGuards(AuthenticationGuard, RolesGuard)
@Controller('projects')
export class ProjectController {
    constructor(private readonly projectsService: ProjectService) {}

    //@Roles(Role.MANAGER)
    @Post()
    @ApiOperation({ summary: 'Create a project' })
    async create(@Body() createProjectDto: CreateProjectDto) {
        return this.projectsService.create(createProjectDto);
    }

    //@Roles(Role.MANAGER)
    @Get()
    @ApiOperation({ summary: 'Get all projects' })
    findAll() {
        return this.projectsService.findAll();
    }

    //@Roles(Role.MANAGER)
    @Get(':id')
    @ApiOperation({ summary: 'Get a project by id' })
    findOne(@Param('id') id: string) {
        return this.projectsService.findOne(id);
    }

    //@Roles(Role.MANAGER)
    @Patch(':id')
    @ApiOperation({ summary: 'Update a project' })
    update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
        return this.projectsService.update(id, updateProjectDto);
    }

    //@Roles(Role.MANAGER)
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a project' })
    @HttpCode(204)
    remove(@Param('id') id: string) {
        return this.projectsService.remove(id);
    }
}
