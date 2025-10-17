import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshDto {
    @ApiProperty({ description: 'Refresh Token ', example: 'eyzdlnzdaopzdjaz' })
    @IsString()
    @IsNotEmpty()
    refreshToken: string;
}
