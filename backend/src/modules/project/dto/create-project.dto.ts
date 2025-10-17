import { IsString, IsDateString, IsEnum } from 'class-validator';
import { Status } from '../../../common/enums/status.enum';

export class CreateProjectDto {
    @IsString()
    name: string;

    @IsString()
    clientName: string;

    @IsDateString()
    startDate: Date;

    @IsDateString()
    endDate: Date;

    @IsEnum(Status)
    status: Status;
}
