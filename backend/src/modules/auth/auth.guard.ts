import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Role } from '../user/enums/role.enum';
import { Request } from 'express';

@Injectable()
export class AuthenticationGuard extends AuthGuard('jwt') {}

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.get<Role[]>('roles', context.getHandler());
        if (!roles) return true;
        const request = context.switchToHttp().getRequest<Request>();
        if (!request.user) return false;
        const user = request.user;
        if (!user.role) return false;
        return roles.includes(user.role);
    }
}
