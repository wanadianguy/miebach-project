import { Entity, ManyToOne, Property } from '@mikro-orm/postgresql';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Project } from '../../project/entities/project.entity';
import { User } from '../../user/entities/user.entity';

@Entity({ tableName: 'staffs' })
export class Staff extends BaseEntity {
    @Property()
    roleName: string;

    @Property()
    hourlyRate: number;

    @Property()
    forecastedHours: number;

    @ManyToOne(() => Project, { updateRule: 'cascade', deleteRule: 'cascade' })
    project!: Project;

    @ManyToOne(() => User, { updateRule: 'cascade', deleteRule: 'cascade' })
    user!: User;
}
