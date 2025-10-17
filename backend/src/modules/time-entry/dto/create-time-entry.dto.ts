import { IsUUID, IsDateString, IsNumber, IsBoolean } from 'class-validator';

export class CreateTimeEntryDto {
    @IsUUID()
    userId: string;

    @IsUUID()
    taskId: string;

    @IsDateString()
    workDate: Date;

    @IsNumber()
    hours: number;

    @IsBoolean()
    isBillable: boolean;
}
