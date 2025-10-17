import { Entity, ManyToOne, Property } from '@mikro-orm/postgresql';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Project } from '../../project/entities/project.entity';

@Entity({ tableName: 'invoices' })
export class Invoice extends BaseEntity {
    @Property()
    clientName: string;

    @Property()
    startDate: Date;

    @Property()
    endDate: Date;

    @Property()
    amount: number;

    @ManyToOne(() => Project, { updateRule: 'cascade', deleteRule: 'cascade' })
    project!: Project;
}
