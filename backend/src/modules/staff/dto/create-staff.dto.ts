import { IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateStaffDto {
    @IsString()
    roleName: string;

    @IsNumber()
    hourlyRate: number;

    @IsNumber()
    forecastedHours: number;

    @IsUUID()
    projectId: string;

    @IsUUID()
    userId: string;
}
