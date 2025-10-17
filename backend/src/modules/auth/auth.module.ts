import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from '../user/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { RefreshToken } from './entities/refresh-token.entity';

@Module({
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    imports: [MikroOrmModule.forFeature([User, RefreshToken]), PassportModule],
})
export class AuthModule {}
