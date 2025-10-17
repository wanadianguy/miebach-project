import { Body, Controller, Delete, Get, HttpCode, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { AssignmentService } from './assignment.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';

//@UseGuards(AuthenticationGuard, RolesGuard)
@Controller('assignments')
export class AssignmentController {
    constructor(private readonly assignmentsService: AssignmentService) {}

    //@Roles(Role.MANAGER)
    @Post()
    create(@Body() dto: CreateAssignmentDto) {
        return this.assignmentsService.create(dto);
    }

    //@Roles(Role.MANAGER)
    @Get()
    findAll() {
        return this.assignmentsService.findAll();
    }

    //@Roles(Role.MANAGER)
    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.assignmentsService.findOne(id);
    }

    //@Roles(Role.MANAGER)
    @Get('task/:taskId')
    findByTask(@Param('taskId', ParseUUIDPipe) taskId: string) {
        return this.assignmentsService.findByTask(taskId);
    }

    //@Roles(Role.MANAGER)
    @Get('user/:userId')
    findByUser(@Param('userId', ParseUUIDPipe) userId: string) {
        return this.assignmentsService.findByUser(userId);
    }

    //@Roles(Role.MANAGER)
    @Delete(':id')
    @HttpCode(204)
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.assignmentsService.remove(id);
    }
}
