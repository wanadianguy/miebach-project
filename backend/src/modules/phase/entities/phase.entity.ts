import { Collection, Entity, Enum, ManyToOne, OneToMany, Property } from '@mikro-orm/postgresql';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Project } from '../../project/entities/project.entity';
import { Task } from '../../task/entities/task.entity';
import { Status } from '../../../common/enums/status.enum';

@Entity({ tableName: 'phases' })
export class Phase extends BaseEntity {
    @Property()
    name: string;

    @Property()
    startDate: Date;

    @Property()
    endDate: Date;

    @Property({ default: 0 })
    budget: number;

    @Enum({ items: () => Status, nativeEnumName: 'phase_status', default: Status.PLANNED })
    status: string;

    @ManyToOne(() => Project, { updateRule: 'cascade', deleteRule: 'cascade' })
    project!: Project;

    @OneToMany(() => Task, (task) => task.phase)
    tasks = new Collection<Task>(this);
}
