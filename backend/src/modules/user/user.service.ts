import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { EntityManager } from '@mikro-orm/postgresql';
import { Role } from './enums/role.enum';

@Injectable()
export class UserService {
    constructor(private readonly em: EntityManager) {}

    async getUsers() {
        return await this.em.find(User, {});
    }

    async findByRole(role: string) {
        if (!Object.values<string>(Role).includes(role)) throw new NotFoundException('Role not found');
        return this.em.find(User, { role: role as Role });
    }

    async remove(id: string) {
        const user = await this.em.findOne(User, { id });
        if (user) await this.em.removeAndFlush(user);
    }
}
