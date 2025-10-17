import { BaseEntity } from '../../../common/entities/base.entity';
import { Collection, Entity, Enum, OneToMany, Property } from '@mikro-orm/postgresql';
import { Role } from '../enums/role.enum';
import { RefreshToken } from '../../../modules/auth/entities/refresh-token.entity';
import { TimeEntry } from '../../time-entry/entities/time-entry.entity';
import { Assignment } from '../../assignment/entities/assignment.entity';
import { Staff } from '../../staff/entities/staff.entity';

@Entity({ tableName: 'users' })
export class User extends BaseEntity {
    @Property()
    name: string;

    @Property({ unique: true })
    email: string;

    @Property({ hidden: true })
    password: string;

    @Enum({ items: () => Role, nativeEnumName: 'user_role' })
    role: Role;

    @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
    refreshTokens? = new Collection<RefreshToken>(this);

    @OneToMany(() => TimeEntry, (timeEntry) => timeEntry.user)
    timeEntries = new Collection<TimeEntry>(this);

    @OneToMany(() => Assignment, (assignment) => assignment.user)
    assignments = new Collection<Assignment>(this);

    @OneToMany(() => Staff, (staff) => staff.user)
    staffing = new Collection<Staff>(this);
}
