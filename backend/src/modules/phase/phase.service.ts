import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePhaseDto } from './dto/create-phase.dto';
import { UpdatePhaseDto } from './dto/update-phase.dto';
import { EntityManager } from '@mikro-orm/postgresql';
import { Phase } from './entities/phase.entity';
import { Project } from '../project/entities/project.entity';

@Injectable()
export class PhaseService {
    constructor(private readonly em: EntityManager) {}

    async create(createPhaseDto: CreatePhaseDto) {
        const project = await this.em.findOne(Project, { id: createPhaseDto.projectId });
        if (!project) throw new NotFoundException(`Project not found`);

        const phase = this.em.create(Phase, {
            ...createPhaseDto,
            budget: 0,
            project,
        });

        await this.em.persistAndFlush(phase);
        return phase;
    }

    async findAll() {
        return this.em.find(Phase, {}, { populate: ['project', 'tasks'] });
    }

    async findOne(id: string) {
        const phase = await this.em.findOne(Phase, { id }, { populate: ['project', 'tasks'] });
        if (!phase) throw new NotFoundException('Phase not found');
        return phase;
    }

    async findByProject(projectId: string) {
        const project = await this.em.findOne(Project, { id: projectId });
        if (!project) throw new NotFoundException('Project not found');

        return this.em.find(Phase, { project }, { populate: ['tasks'] });
    }

    async update(id: string, updatePhaseDto: UpdatePhaseDto) {
        const phase = await this.findOne(id);

        if (updatePhaseDto.projectId) {
            const project = await this.em.findOne(Project, { id: updatePhaseDto.projectId });
            if (!project) throw new NotFoundException('Project not found');
            this.em.assign(phase, { ...updatePhaseDto, projectId: undefined, project });
        } else {
            this.em.assign(phase, updatePhaseDto);
        }

        await this.em.flush();
        return phase;
    }

    async remove(id: string) {
        const phase = await this.findOne(id);
        await this.em.removeAndFlush(phase);
    }
}
