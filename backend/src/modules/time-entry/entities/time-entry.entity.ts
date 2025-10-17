import { Entity, ManyToOne, Property } from '@mikro-orm/postgresql';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../user/entities/user.entity';
import { Task } from '../../task/entities/task.entity';

@Entity({ tableName: 'timeEntries' })
export class TimeEntry extends BaseEntity {
    @Property()
    workDate: Date;

    @Property()
    hours: number;

    @Property()
    isBillable: boolean;

    @ManyToOne(() => User, { updateRule: 'cascade', deleteRule: 'cascade' })
    user!: User;

    @ManyToOne(() => Task, { updateRule: 'cascade', deleteRule: 'cascade' })
    task!: Task;
}
