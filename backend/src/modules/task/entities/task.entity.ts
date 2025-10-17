import { Collection, Entity, Enum, ManyToOne, OneToMany, Property } from '@mikro-orm/postgresql';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Phase } from '../../phase/entities/phase.entity';
import { TimeEntry } from '../../time-entry/entities/time-entry.entity';
import { Status } from '../../../common/enums/status.enum';
import { Assignment } from '../../assignment/entities/assignment.entity';

@Entity({ tableName: 'tasks' })
export class Task extends BaseEntity {
    @Property()
    title: string;

    @Property()
    description: string;

    @Property()
    startDate: Date;

    @Property()
    endDate: Date;

    @Property()
    dueDate: Date;

    @Enum({ items: () => Status, nativeEnumName: 'task_status', default: Status.PLANNED })
    status: string;

    @Property({ default: 0 })
    budget: number;

    @OneToMany(() => Assignment, (assignment) => assignment.task)
    assignments = new Collection<Assignment>(this);

    @ManyToOne(() => Phase, { updateRule: 'cascade', deleteRule: 'cascade' })
    phase!: Phase;

    @OneToMany(() => TimeEntry, (timeEntry) => timeEntry.task)
    timeEntries = new Collection<TimeEntry>(this);
}
