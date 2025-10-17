import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';
import { Role } from 'src/modules/user/enums/role.enum';

export class RegisterDto {
    @ApiProperty({ description: 'Name', example: 'William' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: 'Email', example: 'william@test.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'Password', example: 'secretPassword' })
    @IsString()
    @IsStrongPassword(
        {
            minLength: 1,
            minLowercase: 0,
            minUppercase: 0,
            minNumbers: 0,
            minSymbols: 0,
        },
        { message: 'Password not strong enough' },
    )
    password: string;

    @ApiProperty({ description: 'Role', example: Role.CONTRIBUTOR, enum: Role })
    @IsEnum(Role)
    role: Role;
}
