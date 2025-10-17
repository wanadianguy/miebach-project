import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';
import { UserModule } from './modules/user/user.module';
import { InvoiceModule } from './modules/invoice/invoice.module';
import { TimeEntryModule } from './modules/time-entry/time-entry.module';
import { TaskModule } from './modules/task/task.module';
import { ProjectModule } from './modules/project/project.module';
import { PhaseModule } from './modules/phase/phase.module';
import { StaffModule } from './modules/staff/staff.module';
import { AssignmentModule } from './modules/assignment/assignment.module';

@Module({
    imports: [
        ConfigModule.forRoot(),
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '5m' },
        }),
        MikroOrmModule.forRoot({
            host: process.env.DB_HOST || 'localhost',
            port: Number(process.env.DB_PORT) || 5432,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            dbName: process.env.DB_NAME,
            driver: PostgreSqlDriver,
            driverOptions: {
                connection: {
                    reconnect: true,
                    connectTimeoutMillis: 5000,
                },
            },
            extensions: [Migrator],
            entities: ['dist/**/*.entity.js'],
            entitiesTs: ['src/**/*.entity.ts'],
        }),
        AuthModule,
        UserModule,
        InvoiceModule,
        PhaseModule,
        ProjectModule,
        TaskModule,
        TimeEntryModule,
        StaffModule,
        AssignmentModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
