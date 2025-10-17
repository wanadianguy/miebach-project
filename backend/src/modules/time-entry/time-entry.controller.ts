import { Controller, Get, Post, Body, Param, Delete, HttpCode } from '@nestjs/common';
import { TimeEntryService } from './time-entry.service';
import { CreateTimeEntryDto } from './dto/create-time-entry.dto';
import { ApiOperation } from '@nestjs/swagger';

//@UseGuards(AuthenticationGuard, RolesGuard)
@Controller('time-entries')
export class TimeEntryController {
    constructor(private readonly timeEntriesService: TimeEntryService) {}

    @Post()
    @ApiOperation({ summary: 'Create a time entry' })
    create(@Body() createTimeEntryDto: CreateTimeEntryDto) {
        return this.timeEntriesService.create(createTimeEntryDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all time entries' })
    findAll() {
        return this.timeEntriesService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a time entry by id' })
    findOne(@Param('id') id: string) {
        return this.timeEntriesService.findOne(id);
    }

    @Get('task/:taskId/user/:userId')
    @ApiOperation({ summary: 'Get time entries by task id and user id' })
    findByTaskAndUser(@Param('taskId') taskId: string, @Param('userId') userId: string) {
        return this.timeEntriesService.findByTaskAndUser(taskId, userId);
    }

    @Get('user/:userId')
    @ApiOperation({ summary: 'Get time entries by user id' })
    findByUser(@Param('userId') userId: string) {
        return this.timeEntriesService.findByUser(userId);
    }

    @Get('task/:taskId')
    @ApiOperation({ summary: 'Get time entries by task id' })
    findByTask(@Param('taskId') taskId: string) {
        return this.timeEntriesService.findByTask(taskId);
    }

    @Get('project/:projectId')
    @ApiOperation({ summary: 'Get time entries by project id' })
    findByProject(@Param('projectId') projectId: string) {
        return this.timeEntriesService.findByProject(projectId);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a time entry' })
    @HttpCode(204)
    remove(@Param('id') id: string) {
        return this.timeEntriesService.remove(id);
    }
}
