import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTimeEntryDto } from './dto/create-time-entry.dto';
import { EntityManager } from '@mikro-orm/postgresql';
import { Project } from '../project/entities/project.entity';
import { TimeEntry } from './entities/time-entry.entity';
import { User } from '../user/entities/user.entity';
import { Task } from '../task/entities/task.entity';
import { Phase } from '../phase/entities/phase.entity';
import { Assignment } from '../assignment/entities/assignment.entity';

@Injectable()
export class TimeEntryService {
    constructor(private readonly em: EntityManager) {}

    private async recalcBudgets(hours: number, hourlyRate: number, task: Task, isPlus: boolean) {
        const phase = await this.em.findOne(Phase, { id: task.phase.id });
        const project = await this.em.findOne(Project, { id: task.phase.project.id });

        if (isPlus) {
            this.em.assign(task, { budget: task.budget + hourlyRate * hours });
            if (phase) this.em.assign(phase, { budget: phase.budget + hourlyRate * hours });
            if (project) this.em.assign(project, { budget: project.budget + hourlyRate * hours });
        } else {
            this.em.assign(task, { budget: task.budget - hourlyRate * hours });
            if (phase) this.em.assign(phase, { budget: phase.budget - hourlyRate * hours });
            if (project) this.em.assign(project, { budget: project.budget - hourlyRate * hours });
        }

        await this.em.flush();
    }

    async create(dto: CreateTimeEntryDto) {
        const user = await this.em.findOne(User, { id: dto.userId });
        if (!user) throw new NotFoundException('User not found');

        const task = await this.em.findOne(Task, { id: dto.taskId }, { populate: ['phase', 'phase.project', 'assignments'] });
        if (!task) throw new NotFoundException('Task not found');

        const timeEntry = this.em.create(TimeEntry, {
            ...dto,
            user,
            task,
        });

        await this.em.persistAndFlush(timeEntry);

        const assignment = await this.em.findOne(Assignment, { task: { id: task.id }, user: { id: user.id } });

        if (timeEntry.isBillable && assignment) await this.recalcBudgets(timeEntry.hours, assignment.hourlyRate, task, true);

        return timeEntry;
    }

    async findAll() {
        return this.em.find(TimeEntry, {}, { populate: ['user', 'task'] });
    }

    async findOne(id: string) {
        const entry = await this.em.findOne(TimeEntry, { id }, { populate: ['user', 'task'] });
        if (!entry) throw new NotFoundException('Time entry not found');
        return entry;
    }

    async findByTaskAndUser(taskId: string, userId: string) {
        const task = await this.em.findOne(Task, { id: taskId });
        if (!task) throw new NotFoundException('Task not found');

        const user = await this.em.findOne(User, { id: userId });
        if (!user) throw new NotFoundException('User not found');

        return this.em.find(TimeEntry, { task, user });
    }

    async findByUser(userId: string) {
        const user = await this.em.findOne(User, { id: userId });
        if (!user) throw new NotFoundException('User not found');
        return this.em.find(TimeEntry, { user }, { populate: ['task'] });
    }

    async findByTask(taskId: string) {
        const task = await this.em.findOne(Task, { id: taskId });
        if (!task) throw new NotFoundException('Task not found');
        return this.em.find(TimeEntry, { task }, { populate: ['user'] });
    }

    async findByProject(projectId: string) {
        const project = await this.em.findOne(Project, { id: projectId }, { populate: ['phases', 'phases.tasks'] });
        if (!project) throw new NotFoundException('Project not found');

        const taskIds = project.phases
            .getItems()
            .flatMap((phase) => phase.tasks.getItems())
            .map((task) => task.id);

        return this.em.find(
            TimeEntry,
            { task: { id: { $in: taskIds } } },
            { populate: ['user', 'task', 'task.phase', 'task.assignments'] },
        );
    }

    async remove(id: string) {
        const entry = await this.findOne(id);
        const task = await this.em.findOne(Task, { id: entry.task.id }, { populate: ['phase', 'phase.project', 'assignments'] });
        await this.em.removeAndFlush(entry);

        const assignment = await this.em.findOne(Assignment, { task: { id: entry.task.id }, user: { id: entry.user.id } });

        if (entry.isBillable && assignment && task) await this.recalcBudgets(entry.hours, assignment.hourlyRate, task, false);
    }
}
