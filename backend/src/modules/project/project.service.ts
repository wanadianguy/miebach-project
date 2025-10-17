import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { EntityManager } from '@mikro-orm/postgresql';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectService {
    constructor(private readonly em: EntityManager) {}

    async create(createProjectDto: CreateProjectDto) {
        const project = this.em.create(Project, { ...createProjectDto, budget: 0, forecastedBudget: 0 });
        await this.em.persistAndFlush(project);
        return project;
    }

    async findAll() {
        return this.em.find(Project, {}, { populate: ['phases', 'phases.tasks', 'invoices', 'staffing', 'staffing.user'] });
    }

    async findOne(id: string) {
        const project = await this.em.findOne(
            Project,
            { id },
            { populate: ['phases', 'phases.tasks', 'invoices', 'staffing', 'staffing.user'] },
        );
        if (!project) throw new NotFoundException('Project not found');
        return project;
    }

    async update(id: string, updateProjectDto: UpdateProjectDto) {
        const project = await this.findOne(id);
        this.em.assign(project, updateProjectDto);
        await this.em.flush();
        return project;
    }

    async remove(id: string) {
        const project = await this.findOne(id);
        if (project) await this.em.removeAndFlush(project);
    }
}
