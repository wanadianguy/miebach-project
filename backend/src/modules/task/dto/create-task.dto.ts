import { IsString, IsDateString, IsUUID, IsEnum } from 'class-validator';
import { Status } from '../../../common/enums/status.enum';

export class CreateTaskDto {
    @IsUUID()
    phaseId: string;

    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsDateString()
    startDate: Date;

    @IsDateString()
    dueDate: Date;

    @IsDateString()
    endDate: Date;

    @IsEnum(Status)
    status: Status;
}
