import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from './entities/user.entity';

@Module({
    controllers: [UserController],
    providers: [UserService],
    imports: [MikroOrmModule.forFeature([User])],
})
export class UserModule {}
