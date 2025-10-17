import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStaffDto } from './dto/create-staff.dto';
import { Staff } from './entities/staff.entity';
import { Project } from '../project/entities/project.entity';
import { User } from '../user/entities/user.entity';
import { UpdateStaffDto } from './dto/update-staff.dto';

@Injectable()
export class StaffService {
    constructor(private readonly em: EntityManager) {}

    async create(dto: CreateStaffDto): Promise<Staff> {
        const project = await this.em.findOne(Project, { id: dto.projectId });
        const user = await this.em.findOne(User, { id: dto.userId });

        if (!project) throw new NotFoundException(`Project ${dto.projectId} not found`);
        if (!user) throw new NotFoundException(`User ${dto.userId} not found`);

        const staff = this.em.create(Staff, {
            roleName: dto.roleName,
            hourlyRate: dto.hourlyRate,
            forecastedHours: dto.forecastedHours,
            project,
            user,
        });

        await this.em.persistAndFlush(staff);

        await this.recalcForecastedBudget(staff.forecastedHours, staff.hourlyRate, project, true);

        return staff;
    }

    private async recalcForecastedBudget(hours: number, hourlyRate: number, project: Project, isPlus: boolean) {
        if (isPlus) {
            this.em.assign(project, { forecastedBudget: project.forecastedBudget + hourlyRate * hours });
        } else {
            this.em.assign(project, { forecastedBudget: project.forecastedBudget - hourlyRate * hours });
        }

        await this.em.flush();
    }

    async findAll(): Promise<Staff[]> {
        return this.em.find(Staff, {}, { populate: ['project', 'user'] });
    }

    async findOne(id: string): Promise<Staff> {
        const staff = await this.em.findOne(Staff, { id }, { populate: ['project', 'user'] });
        if (!staff) throw new NotFoundException(`Staff ${id} not found`);
        return staff;
    }

    async findByProject(projectId: string): Promise<Staff[]> {
        return this.em.find(Staff, { project: { id: projectId } }, { populate: ['project', 'user'] });
    }

    async findByUser(userId: string): Promise<Staff[]> {
        return this.em.find(Staff, { user: { id: userId } }, { populate: ['project', 'user'] });
    }

    async update(id: string, dto: UpdateStaffDto): Promise<Staff> {
        const staff = await this.findOne(id);

        if (dto.projectId) {
            const project = await this.em.findOne(Project, { id: dto.projectId });
            if (!project) throw new NotFoundException(`Project ${dto.projectId} not found`);
            staff.project = project;
        }

        if (dto.userId) {
            const user = await this.em.findOne(User, { id: dto.userId });
            if (!user) throw new NotFoundException(`User ${dto.userId} not found`);
            staff.user = user;
        }

        this.em.assign(staff, dto);
        await this.em.flush();
        return staff;
    }

    async remove(id: string): Promise<void> {
        const staff = await this.findOne(id);
        const project = await this.em.findOne(Project, { staffing: { id: staff.id } });

        if (project) await this.recalcForecastedBudget(staff.forecastedHours, staff.hourlyRate, project, false);

        await this.em.removeAndFlush(staff);
    }
}
