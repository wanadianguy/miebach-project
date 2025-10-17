import { Collection, Entity, Enum, OneToMany, Property } from '@mikro-orm/postgresql';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Phase } from '../../phase/entities/phase.entity';
import { Invoice } from '../../invoice/entities/invoice.entity';
import { Staff } from '../../staff/entities/staff.entity';
import { Status } from '../../../common/enums/status.enum';

@Entity({ tableName: 'projects' })
export class Project extends BaseEntity {
    @Property()
    name: string;

    @Property()
    clientName: string;

    @Property()
    startDate: Date;

    @Property()
    endDate: Date;

    @Property({ default: 0 })
    budget: number;

    @Property({ default: 0 })
    forecastedBudget: number;

    @Enum({ items: () => Status, nativeEnumName: 'project_status', default: Status.PLANNED })
    status: string;

    @OneToMany(() => Staff, (staff) => staff.project)
    staffing = new Collection<Staff>(this);

    @OneToMany(() => Phase, (phase) => phase.project)
    phases = new Collection<Phase>(this);

    @OneToMany(() => Invoice, (invoice) => invoice.project)
    invoices = new Collection<Invoice>(this);
}
