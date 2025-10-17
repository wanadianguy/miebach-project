import { PrimaryKey, Property } from '@mikro-orm/postgresql';

export abstract class BaseEntity {
    @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
    id: string;

    @Property({ defaultRaw: 'CURRENT_TIMESTAMP' })
    createdAt?: Date = new Date();

    @Property({ defaultRaw: 'CURRENT_TIMESTAMP', onUpdate: () => new Date() })
    updatedAt?: Date = new Date();
}
