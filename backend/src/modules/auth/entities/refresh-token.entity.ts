import { Entity, ManyToOne, Property } from '@mikro-orm/postgresql';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../user/entities/user.entity';

@Entity({ tableName: 'refresh_tokens' })
export class RefreshToken extends BaseEntity {
    @Property()
    refreshToken: string;

    @ManyToOne(() => User, { updateRule: 'cascade', deleteRule: 'cascade' })
    user: User;
}
