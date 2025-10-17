import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { EntityManager } from '@mikro-orm/postgresql';
import { Task } from './entities/task.entity';
import { Phase } from '../phase/entities/phase.entity';

@Injectable()
export class TaskService {
    constructor(private readonly em: EntityManager) {}

    async create(createTaskDto: CreateTaskDto) {
        const phase = await this.em.findOne(Phase, { id: createTaskDto.phaseId });
        if (!phase) throw new NotFoundException('Phase not found');

        const task = this.em.create(Task, {
            ...createTaskDto,
            budget: 0,
            phase,
        });

        await this.em.persistAndFlush(task);
        return task;
    }

    async findAll() {
        return this.em.find(Task, {}, { populate: ['phase', 'timeEntries', 'assignments'] });
    }

    async findOne(id: string) {
        const task = await this.em.findOne(Task, { id }, { populate: ['phase', 'timeEntries', 'assignments'] });
        if (!task) throw new NotFoundException('Task not found');
        return task;
    }

    async findByPhase(phaseId: string) {
        const phase = await this.em.findOne(Phase, { id: phaseId });
        if (!phase) throw new NotFoundException('Phase not found');

        return this.em.find(Task, { phase }, { populate: ['timeEntries', 'assignments'] });
    }

    async update(id: string, updateTaskDto: UpdateTaskDto) {
        const task = await this.findOne(id);

        if (updateTaskDto.phaseId) {
            const phase = await this.em.findOne(Phase, { id: updateTaskDto.phaseId });
            if (!phase) throw new NotFoundException('Phase not found');
            this.em.assign(task, { ...updateTaskDto, phaseId: undefined, phase });
        } else {
            this.em.assign(task, updateTaskDto);
        }

        await this.em.flush();
        return task;
    }

    async remove(id: string) {
        const task = await this.findOne(id);
        await this.em.removeAndFlush(task);
    }
}
