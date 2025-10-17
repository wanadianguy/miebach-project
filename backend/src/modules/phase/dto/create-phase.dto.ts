import { IsString, IsDateString, IsUUID, IsEnum } from 'class-validator';
import { Status } from '../../../common/enums/status.enum';

export class CreatePhaseDto {
    @IsUUID()
    projectId: string;

    @IsString()
    name: string;

    @IsDateString()
    startDate: Date;

    @IsDateString()
    endDate: Date;

    @IsEnum(Status)
    status: Status;
}
