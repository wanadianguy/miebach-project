import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
    @ApiProperty({ description: 'Email', example: 'william@test.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'Password', example: 'secretPassword' })
    @IsString()
    @IsNotEmpty()
    password: string;
}
