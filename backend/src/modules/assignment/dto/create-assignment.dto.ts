import { IsUUID } from 'class-validator';

export class CreateAssignmentDto {
    @IsUUID()
    taskId: string;

    @IsUUID()
    userId: string;
}
