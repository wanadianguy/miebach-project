import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { User } from '../user/entities/user.entity';
import * as argon from 'argon2';
import { LoginDto } from './dto/login.dto';
import { Tokens } from './types/tokens.type';
import { JwtPayload } from './types/jwt-payload.type';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from './entities/refresh-token.entity';
import { RefreshDto } from './dto/refresh.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly entityManager: EntityManager,
        @InjectRepository(User) private readonly userRepository: EntityRepository<User>,
        @InjectRepository(RefreshToken) private readonly refreshTokenRepository: EntityRepository<RefreshToken>,
        private jwtService: JwtService,
    ) {}

    async register(registerDto: RegisterDto) {
        const user = await this.userRepository.findOne({ email: registerDto.email });
        if (user) throw new UnauthorizedException("Email isn't valid");
        const hashedPassword = await argon.hash(registerDto.password);
        const newUser = this.entityManager.create(User, {
            name: registerDto.name,
            email: registerDto.email,
            password: hashedPassword,
            role: registerDto.role,
        });
        await this.entityManager.persistAndFlush(newUser);
        return newUser;
    }

    async login(loginDto: LoginDto) {
        const user = await this.userRepository.findOne({ email: loginDto.email });
        if (!user) throw new UnauthorizedException('Bad credentials');
        const doPasswordsMatches = await argon.verify(user.password, loginDto.password);
        if (!doPasswordsMatches) throw new UnauthorizedException('Bad credentials');
        const tokens: Tokens = {
            accessToken: this.generateAccessToken({ sub: user.id, role: user.role }),
            refreshToken: this.generateRefreshToken({ sub: user.id }),
        };
        const newRefreshToken = this.entityManager.create(RefreshToken, {
            refreshToken: tokens.refreshToken,
            user: user,
        });
        await this.entityManager.persistAndFlush(newRefreshToken);
        return tokens;
    }

    async refresh(refreshDto: RefreshDto) {
        const refreshToken = await this.refreshTokenRepository.findOne({ refreshToken: refreshDto.refreshToken });
        if (!refreshToken) throw new UnauthorizedException('Refresh token not found');
        await this.entityManager.removeAndFlush(refreshToken);
        const payload = await this.jwtService
            .verifyAsync<JwtPayload>(refreshDto.refreshToken, { secret: process.env.JWT_REFRESH_SECRET })
            .catch(() => {
                throw new UnauthorizedException('Invalid token');
            });
        const user = await this.userRepository.findOne({ id: payload.sub });
        if (!user) throw new UnauthorizedException('User not found');
        const tokens: Tokens = {
            accessToken: this.generateAccessToken({ sub: user.id, role: user.role }),
            refreshToken: this.generateRefreshToken({ sub: user.id }),
        };
        const newRefreshToken = this.entityManager.create(RefreshToken, {
            refreshToken: tokens.refreshToken,
            user: user,
        });
        await this.entityManager.persistAndFlush(newRefreshToken);
        return tokens;
    }

    async logout(logoutDto: RefreshDto) {
        const refreshToken = await this.refreshTokenRepository.findOne({ refreshToken: logoutDto.refreshToken });
        if (!refreshToken) return;
        await this.entityManager.removeAndFlush(refreshToken);
    }

    private generateAccessToken(jwtPayload: JwtPayload) {
        return this.jwtService.sign(jwtPayload, {
            secret: process.env.JWT_SECRET,
            expiresIn: '5h',
        });
    }

    private generateRefreshToken(jwtPayload: JwtPayload) {
        return this.jwtService.sign(jwtPayload, {
            secret: process.env.JWT_REFRESH_SECRET,
            expiresIn: '2d',
        });
    }
}
