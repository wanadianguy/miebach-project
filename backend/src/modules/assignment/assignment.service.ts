import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { Assignment } from './entities/assignment.entity';
import { Task } from '../task/entities/task.entity';
import { User } from '../user/entities/user.entity';
import { Staff } from '../staff/entities/staff.entity';

@Injectable()
export class AssignmentService {
    constructor(private readonly em: EntityManager) {}

    async create(dto: CreateAssignmentDto) {
        const task = await this.em.findOne(Task, { id: dto.taskId });
        const user = await this.em.findOne(User, { id: dto.userId });

        if (!task) throw new NotFoundException('Task not found');
        if (!user) throw new NotFoundException('User not found');

        const staff = await this.em.findOne(Staff, { project: { phases: { tasks: { id: task.id } } } });

        if (!staff) throw new NotFoundException('Something went wrong');

        const assignment = this.em.create(Assignment, {
            hourlyRate: staff.hourlyRate,
            task,
            user,
        });

        await this.em.persistAndFlush(assignment);
        return assignment;
    }

    async findAll() {
        return this.em.find(Assignment, {}, { populate: ['task', 'user'] });
    }

    async findOne(id: string) {
        const assignment = await this.em.findOne(Assignment, { id }, { populate: ['task', 'user'] });
        if (!assignment) throw new NotFoundException('Assignment not found');
        return assignment;
    }

    async findByTask(taskId: string) {
        return this.em.find(Assignment, { task: { id: taskId } }, { populate: ['task', 'user'] });
    }

    async findByUser(userId: string) {
        return this.em.find(
            Assignment,
            { user: { id: userId } },
            { populate: ['task', 'user', 'task.phase', 'task.phase.project'] },
        );
    }

    async remove(id: string) {
        const assignment = await this.findOne(id);
        await this.em.removeAndFlush(assignment);
    }
}
