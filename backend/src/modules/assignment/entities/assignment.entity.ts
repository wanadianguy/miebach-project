import { Entity, ManyToOne, Property } from '@mikro-orm/postgresql';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../user/entities/user.entity';
import { Task } from '../../task/entities/task.entity';

@Entity({ tableName: 'assignments' })
export class Assignment extends BaseEntity {
    @Property()
    hourlyRate: number;

    @ManyToOne(() => Task, { updateRule: 'cascade', deleteRule: 'cascade' })
    task!: Task;

    @ManyToOne(() => User, { updateRule: 'cascade', deleteRule: 'cascade' })
    user!: User;
}
