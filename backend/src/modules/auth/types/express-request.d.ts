import { Role } from '../../user/enums/role.enum';

declare module 'express' {
    interface Request {
        user: UserPassport;
    }
}

type UserPassport = {
    userId: string;
    role: Role;
};
