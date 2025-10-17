import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { EntityManager } from '@mikro-orm/postgresql';
import { Invoice } from './entities/invoice.entity';
import { Project } from '../project/entities/project.entity';

@Injectable()
export class InvoiceService {
    constructor(private readonly em: EntityManager) {}

    async create(dto: CreateInvoiceDto) {
        const project = await this.em.findOne(Project, { id: dto.projectId });
        if (!project) throw new NotFoundException('Project not found');

        const invoice = this.em.create(Invoice, {
            ...dto,
            project,
        });

        await this.em.persistAndFlush(invoice);
        return invoice;
    }

    async findAll() {
        return this.em.find(Invoice, {}, { populate: ['project'] });
    }

    async findOne(id: string) {
        const invoice = await this.em.findOne(Invoice, { id }, { populate: ['project'] });
        if (!invoice) throw new NotFoundException('Invoice not found');
        return invoice;
    }

    async findByProject(projectId: string) {
        const project = await this.em.findOne(Project, { id: projectId });
        if (!project) throw new NotFoundException('Project not found');
        return this.em.find(Invoice, { project });
    }

    async update(id: string, dto: UpdateInvoiceDto) {
        const invoice = await this.findOne(id);

        if (dto.projectId) {
            const project = await this.em.findOne(Project, { id: dto.projectId });
            if (!project) throw new NotFoundException('Project not found');
            this.em.assign(invoice, { ...dto, projectId: undefined, project: project });
        } else {
            this.em.assign(invoice, dto);
        }

        await this.em.flush();
        return invoice;
    }

    async remove(id: string) {
        const invoice = await this.findOne(id);
        await this.em.removeAndFlush(invoice);
    }
}
