import { IsString, IsDateString, IsNumber, IsUUID } from 'class-validator';

export class CreateInvoiceDto {
    @IsUUID()
    projectId: string;

    @IsString()
    clientName: string;

    @IsDateString()
    startDate: Date;

    @IsDateString()
    endDate: Date;

    @IsNumber()
    amount: number;
}
