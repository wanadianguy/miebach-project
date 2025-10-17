import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, ParseUUIDPipe } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiOperation } from '@nestjs/swagger';

//@UseGuards(AuthenticationGuard, RolesGuard)
@Controller('tasks')
export class TaskController {
    constructor(private readonly tasksService: TaskService) {}

    //@Roles(Role.MANAGER)
    @Post()
    @ApiOperation({ summary: 'Create a task' })
    create(@Body() createTaskDto: CreateTaskDto) {
        return this.tasksService.create(createTaskDto);
    }

    //@Roles(Role.MANAGER)
    @Get()
    @ApiOperation({ summary: 'Get all tasks' })
    findAll() {
        return this.tasksService.findAll();
    }

    //@Roles(Role.MANAGER)
    @Get(':id')
    @ApiOperation({ summary: 'Get a task by id' })
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.tasksService.findOne(id);
    }

    //@Roles(Role.MANAGER)
    @Get('phase/:phaseId')
    @ApiOperation({ summary: 'Get tasks by phase id' })
    findByPhase(@Param('phaseId', ParseUUIDPipe) phaseId: string) {
        return this.tasksService.findByPhase(phaseId);
    }

    //@Roles(Role.MANAGER)
    @Patch(':id')
    @ApiOperation({ summary: 'Update a task' })
    update(@Param('id', ParseUUIDPipe) id: string, @Body() updateTaskDto: UpdateTaskDto) {
        return this.tasksService.update(id, updateTaskDto);
    }

    //@Roles(Role.MANAGER)
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a task' })
    @HttpCode(204)
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.tasksService.remove(id);
    }
}
